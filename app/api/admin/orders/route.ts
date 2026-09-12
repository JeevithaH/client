import { NextRequest, NextResponse } from 'next/server';
import { getAllOrdersAdmin, updateOrderStatus, getOrderById } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';
import { OrderStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const orders = await getAllOrdersAdmin({ status, search });
    return NextResponse.json({ success: true, orders, total: orders.length });
  } catch (error) {
    console.error('[API Admin Orders GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { orderId, status } = body;

    const validStatuses: OrderStatus[] = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
    if (!orderId || !status || !validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json(
        { success: false, message: `Invalid status or missing orderId` },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderId, status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const order = await getOrderById(orderId);
    return NextResponse.json({
      success: true,
      message: `Order status advanced to ${status}`,
      order,
    });
  } catch (error) {
    console.error('[API Admin Orders PUT] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order status' }, { status: 500 });
  }
}
