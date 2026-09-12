import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/razorpay';
import { checkRateLimit, rateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { parseSafeJson, safeErrorResponse } from '@/lib/security';
import { getProductById, validateCouponForCheckout } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/clerk-auth';
import { logSecurityEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (Spec 1, 15, 16)
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.CHECKOUT);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // 2. Safe JSON Parsing
    const { data: body, error: jsonError } = await parseSafeJson<{
      action?: string;
      items?: Array<{
        productId: string;
        variantId: string;
        quantity: number;
      }>;
      couponCode?: string;
      receipt?: string;
      notes?: Record<string, string>;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    }>(req);

    if (jsonError || !body) {
      return safeErrorResponse('Invalid checkout request', 400);
    }

    const { action } = body;

    // Action 1: Create an order on Razorpay with Server-Side Price Calculation (Specs 12, 13, 15)
    if (action === 'create-order') {
      const items = body.items;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return safeErrorResponse('Cart items are required to create an order', 400);
      }

      // Calculate server-side total from DB
      let serverSubtotal = 0;
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity <= 0 || item.quantity > 20) {
          return safeErrorResponse('Invalid cart item quantity', 400);
        }

        const product = await getProductById(item.productId);
        if (!product) {
          return safeErrorResponse(`Product not found`, 400);
        }

        const variant = product.variants?.find(v => v.id === item.variantId);
        if (!variant) {
          return safeErrorResponse(`Selected garment variant unavailable`, 400);
        }

        if (variant.stock < item.quantity) {
          return safeErrorResponse(`Garment variant ${variant.color_name} (${variant.size}) is out of stock`, 400);
        }

        // Always use database price
        const itemPrice = Number(product.price);
        serverSubtotal += itemPrice * item.quantity;
      }

      // Server-side coupon verification
      let discountAmount = 0;
      if (body.couponCode) {
        const authUser = await getAuthenticatedUser(req);
        const couponRes = await validateCouponForCheckout(body.couponCode, serverSubtotal, authUser?.id);
        if (couponRes.valid && couponRes.discountAmount) {
          discountAmount = couponRes.discountAmount;
        }
      }

      // Shipping calculation: Free over ₹999, else ₹150
      const shippingFee = serverSubtotal >= 999 ? 0 : 150;
      const finalServerAmount = Math.max(1, Math.round(serverSubtotal - discountAmount + shippingFee));

      const orderReceipt = body.receipt || `rcpt_${Date.now()}`;
      const rzpOrder = await createRazorpayOrder({
        amount: finalServerAmount,
        receipt: orderReceipt,
        notes: body.notes || {},
      });

      logSecurityEvent('PAYMENT_VERIFY_SUCCESS', 'Razorpay order created with verified server amount', {
        endpoint: '/api/checkout/razorpay',
        details: {
          rzpOrderId: rzpOrder.id,
          calculatedAmount: finalServerAmount,
          itemCount: items.length,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount, // In paise
        currency: rzpOrder.currency,
        calculatedTotal: finalServerAmount,
        keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TWpB2OW5IF4Jcn',
      });
    }

    // Action 2: Verify payment signature (Specs 12, 15)
    if (action === 'verify-payment') {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return safeErrorResponse('Missing required payment verification parameters', 400);
      }

      const isValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        logSecurityEvent('PAYMENT_VERIFY_FAILURE', 'Invalid Razorpay payment signature', {
          endpoint: '/api/checkout/razorpay',
          details: { razorpayOrderId, razorpayPaymentId },
        });
        return safeErrorResponse('Invalid payment signature', 400);
      }

      logSecurityEvent('PAYMENT_VERIFY_SUCCESS', 'Payment signature verified successfully', {
        endpoint: '/api/checkout/razorpay',
        details: { razorpayOrderId, razorpayPaymentId },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      });
    }

    return safeErrorResponse('Invalid checkout action', 400);
  } catch (error) {
    console.error('[API Razorpay] Error:', error);
    return safeErrorResponse('Checkout processing error', 500);
  }
}
