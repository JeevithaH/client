import { NextRequest, NextResponse } from 'next/server';
import {
  createOrderWithInventoryDeduction,
  getOrdersByUserId,
  getProductById,
  validateCouponForCheckout,
  getDb,
} from '@/lib/db';
import { Order } from '@/lib/types';
import { checkRateLimit, rateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import {
  parseSafeJson,
  isValidEmail,
  sanitizeString,
  safeErrorResponse,
  unauthorizedResponse,
  validateRequestOrigin,
} from '@/lib/security';
import { getAuthenticatedUser } from '@/lib/clerk-auth';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { logSecurityEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Rate Limiting (Spec 1, 16)
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.PUBLIC_API);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // 2. Authentication Enforcement & IDOR / BOLA Prevention (Specs 8, 9)
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return unauthorizedResponse('Authentication required to view orders');
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // Admin can view any user's orders or all orders
    if (authUser.role === 'admin') {
      if (requestedUserId) {
        const orders = await getOrdersByUserId(requestedUserId);
        return NextResponse.json({ success: true, orders });
      }
      const dbInstance = getDb();
      const res = await dbInstance
        .prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50')
        .all<Order>();
      return NextResponse.json({ success: true, orders: res.results || [] });
    }

    // Spec 9: Normal patrons can ONLY access their own orders. Client-supplied userId is IGNORED.
    const orders = await getOrdersByUserId(authUser.id);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('[API Orders GET] Error:', error);
    return safeErrorResponse('Failed to fetch orders', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (Spec 1, 12, 16)
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.ORDERS);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // 2. CSRF / Origin Check (Spec 22)
    if (!validateRequestOrigin(req)) {
      return safeErrorResponse('Forbidden: Invalid request origin', 403);
    }

    // 3. Safe JSON Body Parsing (Spec 1)
    const { data: body, error: jsonError } = await parseSafeJson<{
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      shippingAddress?: {
        street?: string;
        apartment?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        postal_code?: string;
        country?: string;
      };
      couponCode?: string;
      paymentMethod?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      items?: Array<{
        productId: string;
        variantId: string;
        quantity: number;
      }>;
    }>(req);

    if (jsonError || !body) {
      return safeErrorResponse('Invalid order request payload', 400);
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      couponCode,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
    } = body;

    // 4. Input Validation (Spec 1, 18)
    if (!customerName || !customerEmail || !isValidEmail(customerEmail)) {
      return safeErrorResponse('Valid customer name and email are required', 400);
    }

    const resolvedPostalCode =
      shippingAddress?.postalCode ||
      shippingAddress?.postal_code ||
      (shippingAddress as unknown as { postal_code?: string })?.postal_code;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !resolvedPostalCode) {
      return safeErrorResponse('Complete shipping address is required', 400);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return safeErrorResponse('Cart items are required', 400);
    }

    // 5. Authenticated User Binding (Spec 7, 9)
    // Never trust client-supplied userId. Bind to session user or generate secure guest patron ID.
    const authUser = await getAuthenticatedUser(req);
    const userId = authUser ? authUser.id : `usr_guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // 6. SERVER-SIDE PRICE RECALCULATION & STOCK VERIFICATION (Specs 12, 13)
    // Client-supplied prices and totals are completely ignored and re-computed from the database.
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const rawItem of items) {
      if (!rawItem.productId || !rawItem.variantId) {
        return safeErrorResponse('Invalid cart item specification', 400);
      }

      const qty = Math.floor(Number(rawItem.quantity));
      if (isNaN(qty) || qty <= 0 || qty > 20) {
        return safeErrorResponse('Invalid item quantity (must be between 1 and 20)', 400);
      }

      // Fetch authentic product and variant from database
      const product = await getProductById(rawItem.productId);
      if (!product) {
        return safeErrorResponse('Product does not exist in atelier collection', 400);
      }

      const variant = product.variants?.find(v => v.id === rawItem.variantId);
      if (!variant) {
        return safeErrorResponse('Selected garment variant is unavailable', 400);
      }

      if (variant.stock < qty) {
        return safeErrorResponse(`Insufficient stock for ${product.title} (${variant.size})`, 400);
      }

      // Server price from database
      const verifiedUnitPrice = Number(product.price);
      verifiedSubtotal += verifiedUnitPrice * qty;

      verifiedItems.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        order_id: '',
        product_id: product.id,
        variant_id: variant.id,
        product_title: product.title,
        color_name: variant.color_name,
        size: variant.size,
        price: verifiedUnitPrice,
        quantity: qty,
        image_url: variant.image_url || product.fabric_details || '',
      });
    }

    // 7. SERVER-SIDE COUPON VALIDATION (Spec 14)
    let verifiedDiscount = 0;
    let validCouponCode: string | undefined = undefined;

    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      const couponCheck = await validateCouponForCheckout(couponCode.trim(), verifiedSubtotal, userId);
      if (couponCheck.valid && couponCheck.discountAmount) {
        verifiedDiscount = couponCheck.discountAmount;
        validCouponCode = couponCheck.coupon?.code;
      } else {
        logSecurityEvent('COUPON_ABUSE_ATTEMPT', 'Order placed with rejected coupon code', {
          userId,
          endpoint: '/api/orders',
          details: { couponCode, reason: couponCheck.message },
        });
      }
    }

    // 8. Shipping Fee & Total Calculation (Spec 12, 13)
    const verifiedShippingFee = verifiedSubtotal >= 999 ? 0 : 150;
    const verifiedTotalAmount = Math.max(1, Math.round(verifiedSubtotal - verifiedDiscount + verifiedShippingFee));

    // 9. PAYMENT VERIFICATION (Spec 15)
    let paymentStatus: 'Pending' | 'Paid' = 'Pending';

    if (razorpayOrderId && razorpayPaymentId) {
      // If signature is provided, verify it strictly
      if (razorpaySignature) {
        const isSignatureValid = verifyRazorpaySignature(
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature
        );

        if (!isSignatureValid) {
          logSecurityEvent('PAYMENT_VERIFY_FAILURE', 'Order creation with forged payment signature', {
            userId,
            endpoint: '/api/orders',
            details: { razorpayOrderId, razorpayPaymentId },
          });
          return safeErrorResponse('Payment signature verification failed', 400);
        }
      }
      paymentStatus = 'Paid';
    }

    // 10. Generate Order ID and Atomic Record Creation
    const orderNumber = `SF-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newOrder = await createOrderWithInventoryDeduction({
      id: orderId,
      order_number: orderNumber,
      user_id: userId,
      customer_name: sanitizeString(customerName),
      customer_email: customerEmail.trim().toLowerCase(),
      customer_phone: customerPhone ? sanitizeString(customerPhone) : '+91 98765 43210',
      shipping_address: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
      subtotal: verifiedSubtotal,
      discount_amount: verifiedDiscount,
      shipping_fee: verifiedShippingFee,
      total_amount: verifiedTotalAmount,
      coupon_code: validCouponCode,
      status: 'Placed',
      payment_status: paymentStatus,
      payment_method: paymentMethod ? sanitizeString(paymentMethod) : 'Razorpay (UPI / Card)',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      items: verifiedItems.map(it => ({ ...it, order_id: orderId })),
    });

    logSecurityEvent('AUTH_SUCCESS', 'Order successfully verified, priced, and stored', {
      userId,
      endpoint: '/api/orders',
      details: {
        orderId: newOrder.id,
        totalAmount: verifiedTotalAmount,
        itemCount: verifiedItems.length,
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created and inventory deducted successfully',
    });
  } catch (error) {
    console.error('[API Orders POST] Error:', error);
    return safeErrorResponse('Unable to process order at this time', 500);
  }
}
