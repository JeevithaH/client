import { NextRequest, NextResponse } from 'next/server';
import { deleteCoupon, saveCoupon, getAllCouponsAdmin } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const all = await getAllCouponsAdmin();
    const existing = all.find((c) => c.id === params.id);

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    const updated = await saveCoupon({
      ...existing,
      ...body,
      id: params.id,
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error('[API Admin Coupon ID PUT] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await deleteCoupon(params.id);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('[API Admin Coupon ID DELETE] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete coupon' }, { status: 500 });
  }
}
