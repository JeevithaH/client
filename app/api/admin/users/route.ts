import { NextRequest, NextResponse } from 'next/server';
import { getAllUsersAdmin, toggleUserStatus, getOrdersByUserId } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // If specific user requested, return user's order history
    if (userId) {
      const orders = await getOrdersByUserId(userId);
      return NextResponse.json({ success: true, orders });
    }

    const users = await getAllUsersAdmin();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('[API Admin Users GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { userId, status } = body;

    if (!userId || (status !== 'active' && status !== 'banned')) {
      return NextResponse.json(
        { success: false, message: 'Invalid userId or status (must be active or banned)' },
        { status: 400 }
      );
    }

    const updated = await toggleUserStatus(userId, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User status updated to ${status}`,
    });
  } catch (error) {
    console.error('[API Admin Users PUT] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update user status' }, { status: 500 });
  }
}
