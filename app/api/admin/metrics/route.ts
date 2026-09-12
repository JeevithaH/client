import { NextResponse } from 'next/server';
import { getAdminDashboardMetrics } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const metrics = await getAdminDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    console.error('[API Admin Metrics] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch metrics' }, { status: 500 });
  }
}
