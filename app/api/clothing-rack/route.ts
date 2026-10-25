import { NextResponse } from 'next/server';
import { getActiveRackGarments } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getActiveRackGarments();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[API Public Clothing Rack GET] Error:', error);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}
