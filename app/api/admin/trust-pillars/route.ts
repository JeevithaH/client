import { NextRequest, NextResponse } from 'next/server';
import { getAllTrustPillarsAdmin, saveTrustPillar } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const pillars = await getAllTrustPillarsAdmin();
    return NextResponse.json({ success: true, pillars });
  } catch (error) {
    console.error('[API Admin Trust Pillars GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve trust pillars' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const success = await saveTrustPillar(body);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to save trust pillar' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Trust pillar saved successfully' });
  } catch (error) {
    console.error('[API Admin Trust Pillars POST] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
