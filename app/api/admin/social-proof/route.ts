import { NextRequest, NextResponse } from 'next/server';
import { getAllSocialProofAdmin, saveSocialProofNotification, deleteSocialProofNotification } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const notifications = await getAllSocialProofAdmin();
    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('[API Admin Social Proof GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve social proof notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const success = await saveSocialProofNotification(body);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to save notification' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Notification saved successfully' });
  } catch (error) {
    console.error('[API Admin Social Proof POST] Error:', error);
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
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const success = await deleteSocialProofNotification(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to delete notification' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('[API Admin Social Proof DELETE] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
