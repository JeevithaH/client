import { NextRequest, NextResponse } from 'next/server';
import { getAllHeroSlidesAdmin, saveHeroSlide, deleteHeroSlide } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const slides = await getAllHeroSlidesAdmin();
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error('[API Admin Hero Slides GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve hero slides' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const success = await saveHeroSlide(body);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to save hero slide' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Hero slide saved successfully' });
  } catch (error) {
    console.error('[API Admin Hero Slides POST] Error:', error);
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
      return NextResponse.json({ success: false, message: 'Slide ID is required' }, { status: 400 });
    }

    const success = await deleteHeroSlide(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to delete hero slide' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Hero slide deleted' });
  } catch (error) {
    console.error('[API Admin Hero Slides DELETE] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
