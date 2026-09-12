import { NextResponse } from 'next/server';
import { getActivePlacements } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const placements = await getActivePlacements();
    return NextResponse.json({ success: true, placements });
  } catch (error) {
    console.error('[API Placements GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve active placements' },
      { status: 500 }
    );
  }
}
