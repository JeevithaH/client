import { NextRequest, NextResponse } from 'next/server';
import { getAllAnnouncementsAdmin, saveAnnouncement, deleteAnnouncement } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const messages = await getAllAnnouncementsAdmin();
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('[API Admin Announcements GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve announcements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const success = await saveAnnouncement(body);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to save announcement' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Announcement saved successfully' });
  } catch (error) {
    console.error('[API Admin Announcements POST] Error:', error);
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
      return NextResponse.json({ success: false, message: 'Announcement ID is required' }, { status: 400 });
    }

    const success = await deleteAnnouncement(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to delete announcement' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    console.error('[API Admin Announcements DELETE] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
