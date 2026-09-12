import { NextRequest, NextResponse } from 'next/server';
import { deletePlacement, togglePlacementActive } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = params;
    const success = await deletePlacement(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Placement not found or already deleted' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Placement banner deleted' });
  } catch (error) {
    console.error('[API Admin Placements DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove placement' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = params;
    const body = await req.json();
    const isActive = Boolean(body.is_active);

    const success = await togglePlacementActive(id, isActive);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Placement not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, is_active: isActive });
  } catch (error) {
    console.error('[API Admin Placements PATCH] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to toggle placement status' },
      { status: 500 }
    );
  }
}
