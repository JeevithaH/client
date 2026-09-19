import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSetting } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('[API Admin Site Settings GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve site settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ success: false, message: 'Setting key is required' }, { status: 400 });
    }

    const success = await updateSiteSetting(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to update setting' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('[API Admin Site Settings POST] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
