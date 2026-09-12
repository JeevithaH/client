import { NextRequest, NextResponse } from 'next/server';
import { getAllCouponsAdmin, saveCoupon } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';
import { Coupon } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const coupons = await getAllCouponsAdmin();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('[API Admin Coupons GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const {
      code,
      discount_type,
      discount_percent,
      discount_amount,
      min_order_value,
      usage_limit,
      per_user_limit,
      expires_at,
      description,
      active,
    } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
    }

    const coupon: Coupon = {
      id: body.id || `coup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      code: code.toUpperCase().trim(),
      discount_type: discount_type || 'percent',
      discount_percent: Number(discount_percent || 0),
      discount_amount: Number(discount_amount || 0),
      min_order_value: Number(min_order_value || 0),
      usage_limit: usage_limit ? Number(usage_limit) : null,
      per_user_limit: Number(per_user_limit || 1),
      times_used: Number(body.times_used || 0),
      expires_at: expires_at || null,
      active: active !== undefined ? Boolean(active) : true,
      description: description || '',
    };

    const saved = await saveCoupon(coupon);

    return NextResponse.json({
      success: true,
      coupon: saved,
      message: `Coupon '${saved.code}' created successfully`,
    });
  } catch (error) {
    console.error('[API Admin Coupons POST] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save coupon' }, { status: 500 });
  }
}
