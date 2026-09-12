import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, getOrderById } from '@/lib/db';
import { OrderStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    const validStatuses: OrderStatus[] = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
    if (!status || !validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json(
        { success: false, message: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const order = await getOrderById(id);
    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error('[API Order Status Update] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order status' }, { status: 500 });
  }
}
