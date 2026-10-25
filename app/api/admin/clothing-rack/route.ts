import { NextRequest, NextResponse } from 'next/server';
import { getAllRackGarmentsAdmin, saveRackGarment, deleteRackGarment } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const items = await getAllRackGarmentsAdmin();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[API Admin Clothing Rack GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve rack items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const success = await saveRackGarment(body);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to save rack item' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Rack garment saved successfully' });
  } catch (error) {
    console.error('[API Admin Clothing Rack POST] Error:', error);
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

    const success = await deleteRackGarment(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to delete rack item' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Rack garment deleted' });
  } catch (error) {
    console.error('[API Admin Clothing Rack DELETE] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
