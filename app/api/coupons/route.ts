import { NextRequest, NextResponse } from 'next/server';
import { validateCouponForCheckout, getCoupons } from '@/lib/db';
import { checkRateLimit, rateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { parseSafeJson, safeErrorResponse } from '@/lib/security';
import { getAuthenticatedUser } from '@/lib/clerk-auth';
import { logSecurityEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.PUBLIC_API);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    const coupons = await getCoupons();
    // Sanitize coupons to not expose internal metrics
    const safeCoupons = coupons.map(c => ({
      code: c.code,
      discount_type: c.discount_type,
      discount_percent: c.discount_percent,
      discount_amount: c.discount_amount,
      min_order_value: c.min_order_value,
      description: c.description,
      expires_at: c.expires_at,
    }));

    return NextResponse.json({ success: true, coupons: safeCoupons });
  } catch (error) {
    console.error('[API Coupons GET] Error:', error);
    return safeErrorResponse('Failed to fetch coupons', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting to prevent coupon brute-force attacks (Spec 14, 16)
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.COUPONS);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // 2. Safe JSON Body Parsing
    const { data: body, error: jsonError } = await parseSafeJson<{
      code?: string;
      subtotal?: number;
    }>(req);

    if (jsonError || !body) {
      return safeErrorResponse('Invalid request payload', 400);
    }

    const { code, subtotal } = body;

    if (!code || typeof code !== 'string') {
      return safeErrorResponse('Coupon code is required', 400);
    }

    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length > 30) {
      return safeErrorResponse('Invalid coupon format', 400);
    }

    const numericSubtotal = Math.max(0, Number(subtotal) || 0);

    // 3. Resolve user identity securely from session, never trust client-supplied userId
    const authUser = await getAuthenticatedUser(req);
    const verifiedUserId = authUser?.id;

    const result = await validateCouponForCheckout(cleanCode, numericSubtotal, verifiedUserId);

    if (!result.valid) {
      logSecurityEvent('COUPON_ABUSE_ATTEMPT', `Coupon validation rejected: ${result.message}`, {
        userId: verifiedUserId,
        endpoint: '/api/coupons',
        details: { code: cleanCode, subtotal: numericSubtotal },
      });
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: result.coupon?.code,
        discount_type: result.coupon?.discount_type,
        discount_percent: result.coupon?.discount_percent,
        discount_amount: result.coupon?.discount_amount,
      },
      discountAmount: result.discountAmount,
      message: result.message,
    });
  } catch (error) {
    console.error('[API Coupons POST] Error:', error);
    return safeErrorResponse('Failed to validate coupon', 500);
  }
}
