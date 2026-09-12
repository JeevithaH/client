import { NextRequest, NextResponse } from 'next/server';
import { getAllPlacementsAdmin, savePlacement } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';
import { PlacementSlot } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const placements = await getAllPlacementsAdmin();
    return NextResponse.json({ success: true, placements });
  } catch (error) {
    console.error('[API Admin Placements GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve placements' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { slot_key, image_url, title, subtitle, badge_text, link_url, cta_text, is_active, display_order, id } = body;

    if (!slot_key) {
      return NextResponse.json(
        { success: false, message: 'Slot placement identifier is required' },
        { status: 400 }
      );
    }
    if (!image_url || !image_url.trim()) {
      return NextResponse.json(
        { success: false, message: 'Ad image URL is required' },
        { status: 400 }
      );
    }

    const saved = await savePlacement({
      id: id || undefined,
      slot_key: slot_key as PlacementSlot,
      title: title || '',
      subtitle: subtitle || '',
      badge_text: badge_text || '',
      image_url: image_url.trim(),
      link_url: link_url || '/shop',
      cta_text: cta_text || 'Explore Collection',
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      display_order: Number(display_order) || 0,
    });

    return NextResponse.json({ success: true, placement: saved });
  } catch (error) {
    console.error('[API Admin Placements POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save banner placement' },
      { status: 500 }
    );
  }
}
