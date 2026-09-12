import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveAuthToken } from '@/lib/db';
import { sendVerificationOtpEmail, sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, type = 'signup_otp' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();
    const existingUser = await getUserByEmail(emailClean);

    if (type === 'signup_otp') {
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'An account with this email is already registered. Please Sign In.' },
          { status: 400 }
        );
      }
    } else if (type === 'password_reset') {
      if (!existingUser) {
        return NextResponse.json(
          { success: false, message: 'No patron account found with this email address' },
          { status: 404 }
        );
      }
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save token with 10-minute expiry
    await saveAuthToken(emailClean, otp, type, 10);

    // Dispatch luxury email
    const recipientName = name || existingUser?.name || 'Esteemed Patron';
    let emailResult;
    if (type === 'signup_otp') {
      emailResult = await sendVerificationOtpEmail(emailClean, recipientName, otp);
    } else {
      emailResult = await sendPasswordResetEmail(emailClean, recipientName, otp);
    }

    const isSandboxRestricted = !emailResult.success && Boolean(emailResult.error?.includes('only send testing emails'));

    return NextResponse.json({
      success: true,
      message: isSandboxRestricted
        ? `Code generated! (Resend Sandbox Note: Direct inbox delivery is currently enabled for your account email: jeevithah648@gmail.com)`
        : `A 6-digit verification code has been dispatched to ${emailClean}`,
      ...(isSandboxRestricted ? { devOtp: otp, sandboxNotice: emailResult.error } : {}),
    });
  } catch (error) {
    console.error('[API Send OTP] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to dispatch verification code' },
      { status: 500 }
    );
  }
}
