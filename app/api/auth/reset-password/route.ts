import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, updateUserPassword, getUserByEmail } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword, clerkVerified } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();

    // 1. If verified by Clerk authentication flow
    if (clerkVerified) {
      const { userId } = auth();
      // Update password in Cloudflare D1 so NextAuth credentials stay in sync
      const updated = await updateUserPassword(emailClean, newPassword);
      return NextResponse.json({
        success: true,
        message: 'Your password has been successfully updated in Cloudflare D1.',
      });
    }

    // 2. Otherwise verify reset token in D1 auth_tokens
    if (!otp) {
      return NextResponse.json(
        { success: false, message: 'Reset code is required' },
        { status: 400 }
      );
    }

    const isValid = await verifyAuthToken(emailClean, otp.trim(), 'password_reset');
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset code. Please request a new code.' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(emailClean);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User account not found' },
        { status: 404 }
      );
    }

    // Update password hash in Cloudflare D1
    const updated = await updateUserPassword(emailClean, newPassword);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Failed to update credentials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully updated. You may now sign in.',
    });
  } catch (error) {
    console.error('[API Reset Password] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Password reset processing error' },
      { status: 500 }
    );
  }
}
