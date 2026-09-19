import { NextRequest, NextResponse } from 'next/server';
import { getAllMarqueeItemsAdmin, saveMarqueeItem, deleteMarqueeItem } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const items = await getAllMarqueeItemsAdmin();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[API Admin Marquee GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve marquee items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const success = await saveMarqueeItem(body);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to save marquee item' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Marquee item saved successfully' });
  } catch (error) {
    console.error('[API Admin Marquee POST] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Item ID is required' }, { status: 400 });
    }

    const success = await deleteMarqueeItem(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to delete marquee item' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Marquee item deleted' });
  } catch (error) {
    console.error('[API Admin Marquee DELETE] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
