import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, createVerifiedUser, getUserByEmail } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, type = 'signup_otp', name, password } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and 6-digit verification code are required' },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();

    // Verify token validity in D1
    const isValid = await verifyAuthToken(emailClean, otp, type);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code. Please request a new code.' },
        { status: 400 }
      );
    }

    // If this is for account registration, create the patron record
    if (type === 'signup_otp') {
      if (!name || !password) {
        return NextResponse.json(
          { success: false, message: 'Name and password are required for registration' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }

      // Re-check duplicate safety
      const existing = await getUserByEmail(emailClean);
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists' },
          { status: 400 }
        );
      }

      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser = await createVerifiedUser({
        id: userId,
        name: name.trim(),
        email: emailClean,
        password,
      });

      return NextResponse.json({
        success: true,
        message: 'Patron account verified and created successfully.',
        user: newUser,
      });
    }

    // If this is password_reset verification step
    return NextResponse.json({
      success: true,
      message: 'Verification code confirmed.',
    });
  } catch (error) {
    console.error('[API Verify OTP] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification processing error' },
      { status: 500 }
    );
  }
}
