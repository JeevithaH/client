import { NextResponse } from 'next/server';
import {
  getActiveAnnouncements,
  getActiveSocialProofNotifications,
  getSiteSettings,
  getActiveMarqueeItems,
  getActiveTrustPillars
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [announcements, socialProof, settings, marquee, trustPillars] = await Promise.all([
      getActiveAnnouncements(),
      getActiveSocialProofNotifications(),
      getSiteSettings(),
      getActiveMarqueeItems(),
      getActiveTrustPillars(),
    ]);

    return NextResponse.json({
      success: true,
      announcements,
      socialProof,
      settings,
      marquee,
      trustPillars,
    });
  } catch (error) {
    console.error('[API Store Config GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve store config' },
      { status: 500 }
    );
  }
}
