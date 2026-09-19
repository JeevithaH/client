'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, KeyRound, RotateCcw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useToast } from '@/context/toast-context';
import { useSignIn, useSignUp, useUser } from '@clerk/nextjs';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl') || searchParams.get('redirect_url');

  // Compute smart callbackUrl:
  // 1. If explicit query parameter is provided and not a login shim: use it.
  // 2. If cart has items in localStorage, always prioritize /checkout so patrons never land on home page.
  // 3. Fallback to /checkout.
  const [callbackUrl, setCallbackUrl] = useState<string>(() => {
    if (rawCallbackUrl && !rawCallbackUrl.startsWith('/login') && !rawCallbackUrl.startsWith('/sign-in')) {
      return rawCallbackUrl;
    }
    return '/checkout';
  });

  useEffect(() => {
    if (rawCallbackUrl && !rawCallbackUrl.startsWith('/login') && !rawCallbackUrl.startsWith('/sign-in')) {
      setCallbackUrl(rawCallbackUrl);
      return;
    }
    try {
      const cartData = localStorage.getItem('shipfold_luxury_cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        if (Array.isArray(items) && items.length > 0) {
          setCallbackUrl('/checkout');
          return;
        }
      }
    } catch {}
    setCallbackUrl('/checkout');
  }, [rawCallbackUrl]);

  const navigateToDestination = (targetUrl: string = callbackUrl) => {
    if (targetUrl === '/checkout' || targetUrl.includes('/checkout')) {
      window.location.href = '/checkout';
    } else {
      router.replace(targetUrl);
    }
  };

  const { success, error: toastError } = useToast();
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useUser();
  const { isLoaded: isSignInLoaded, signIn: clerkSignIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp: clerkSignUp, setActive: setSignUpActive } = useSignUp();

  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  // Fast smooth auto-redirect if already signed in with Clerk or NextAuth
  useEffect(() => {
    if (isClerkLoaded && isClerkSignedIn) {
      // Sync Clerk user to local DB asynchronously
      fetch('/api/auth/sync', { method: 'POST' }).catch(() => {});
      navigateToDestination(callbackUrl);
    } else if (nextAuthStatus === 'authenticated') {
      navigateToDestination(callbackUrl);
    }
  }, [isClerkLoaded, isClerkSignedIn, nextAuthStatus, callbackUrl]);

  // Mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Register steps: 'input' | 'verify_otp'
  const [registerStep, setRegisterStep] = useState<'input' | 'verify_otp'>('input');

  // Forgot password steps: 'request' | 'reset'
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const clearMessages = () => {
    setErrorMessage('');
    setInfoMessage('');
  };

  // ---------------------------------------------------------------------------
  // Action 1: Sign In Flow (Clerk + Local Sync)
  // ---------------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      let clerkSuccess = false;

      // 1. Authenticate via Clerk
      if (isSignInLoaded && clerkSignIn) {
        try {
          const result = await clerkSignIn.create({
            identifier: email.trim(),
            password,
          });

          if (result.status === 'complete' && setSignInActive) {
            await setSignInActive({ session: result.createdSessionId });
            clerkSuccess = true;
          }
        } catch (clerkErr: unknown) {
          const firstErr = (clerkErr as { errors?: Array<{ code?: string; message?: string; longMessage?: string }> })?.errors?.[0];
          if (firstErr?.code === 'form_password_incorrect') {
            setErrorMessage('Incorrect password. Please verify your credentials or reset your password.');
            setLoading(false);
            return;
          }
        }
      }

      if (clerkSuccess) {
        success('Welcome Back', 'Signed into your Shipfold patron account.');
        fetch('/api/auth/sync', { method: 'POST' }).catch(() => {});
        navigateToDestination(callbackUrl);
        return;
      }

      // 2. Fallback to NextAuth credentials (for Admin/Studio Director)
      const nextAuthRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (nextAuthRes?.ok && !nextAuthRes?.error) {
        success('Welcome Back', 'Signed in successfully.');
        navigateToDestination(callbackUrl);
      } else {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action: Sign In / Sign Up with Google (Clerk OAuth)
  // ---------------------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);

    try {
      if (mode === 'register' && isSignUpLoaded && clerkSignUp) {
        try {
          await clerkSignUp.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: '/sso-callback',
            redirectUrlComplete: callbackUrl,
          });
          return;
        } catch {
          // Fallback to signIn if account already exists
          if (isSignInLoaded && clerkSignIn) {
            await clerkSignIn.authenticateWithRedirect({
              strategy: 'oauth_google',
              redirectUrl: '/sso-callback',
              redirectUrlComplete: callbackUrl,
            });
            return;
          }
        }
      }

      if (isSignInLoaded && clerkSignIn) {
        try {
          await clerkSignIn.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: '/sso-callback',
            redirectUrlComplete: callbackUrl,
          });
          return;
        } catch {
          // Fallback to signUp if account is new
          if (isSignUpLoaded && clerkSignUp) {
            await clerkSignUp.authenticateWithRedirect({
              strategy: 'oauth_google',
              redirectUrl: '/sso-callback',
              redirectUrlComplete: callbackUrl,
            });
            return;
          }
        }
      }
    } catch (err: unknown) {
      console.warn('Clerk Google OAuth warning:', err);
      const firstErr = (err as { errors?: Array<{ message?: string }> })?.errors?.[0];
      setErrorMessage(firstErr?.message || 'Failed to initiate Google authentication. Please try with email/password.');
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action 2: Registration Step 1 — Send 6-Digit Email Verification OTP
  // ---------------------------------------------------------------------------
  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUpLoaded && clerkSignUp) {
        try {
          const [firstName, ...rest] = name.trim().split(' ');
          const lastName = rest.join(' ') || undefined;

          await clerkSignUp.create({
            emailAddress: email.trim(),
            password,
            firstName: firstName || 'Patron',
            lastName,
          });

          await clerkSignUp.prepareEmailAddressVerification({
            strategy: 'email_code',
          });

          setRegisterStep('verify_otp');
          setResendCooldown(60);
          setInfoMessage(`We have dispatched a 6-digit verification code to ${email}.`);
          success('Verification Code Dispatched', 'Check your email inbox for your 6-digit code.');
          setLoading(false);
          return;
        } catch (clerkErr: unknown) {
          const firstErr = (clerkErr as { errors?: Array<{ code?: string; message?: string; longMessage?: string }> })?.errors?.[0];
          if (firstErr?.code === 'form_identifier_exists') {
            setErrorMessage('An account with this email already exists. Please sign in.');
            setMode('login');
            setLoading(false);
            return;
          }
          const errMsg = firstErr?.longMessage || firstErr?.message;
          if (errMsg) {
            setErrorMessage(errMsg);
            setLoading(false);
            return;
          }
        }
      }

      // Fallback to local dispatch
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, type: 'signup_otp' }),
      });
      const data = await res.json();
      if (data.success) {
        setRegisterStep('verify_otp');
        setResendCooldown(60);
        setInfoMessage(`We have dispatched a 6-digit verification code to ${email}.`);
        success('Verification Code Sent', 'Check your email inbox for your 6-digit code.');
      } else {
        setErrorMessage(data.message || 'Failed to dispatch verification code.');
      }
    } catch {
      setErrorMessage('Network error while requesting verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action 3: Registration Step 2 — Verify OTP & Complete Account Creation
  // ---------------------------------------------------------------------------
  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanOtp = otp.trim().replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      // 1. Try Clerk verification if clerkSignUp exists
      if (isSignUpLoaded && clerkSignUp && clerkSignUp.id) {
        try {
          const completeSignUp = await clerkSignUp.attemptEmailAddressVerification({
            code: cleanOtp,
          });

          if (completeSignUp.status === 'complete' && setSignUpActive) {
            await setSignUpActive({ session: completeSignUp.createdSessionId });
            success('Account Verified', 'Welcome to the Shipfold circle. Directing you to your destination...');
            fetch('/api/auth/sync', { method: 'POST' }).catch(() => {});
            navigateToDestination(callbackUrl);
            return;
          } else {
            console.warn('Clerk sign-up status after attempt:', completeSignUp.status);
          }
        } catch (clerkErr: unknown) {
          console.warn('Clerk email OTP attempt error:', clerkErr);
          const firstErr = (clerkErr as { errors?: Array<{ message?: string; longMessage?: string; code?: string }> })?.errors?.[0];
          const clerkMsg = firstErr?.longMessage || firstErr?.message;
          if (clerkMsg) {
            setErrorMessage(clerkMsg);
            setLoading(false);
            return;
          }
        }
      }

      // 2. Fallback to Cloudflare D1 local verification
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name, password, otp: cleanOtp, type: 'signup_otp' }),
      });
      const data = await res.json();

      if (data.success) {
        success('Account Verified', 'Welcome to the Shipfold circle. Directing you to your destination...');
        await signIn('credentials', {
          redirect: false,
          email: email.trim(),
          password,
        });
        navigateToDestination(callbackUrl);
      } else {
        setErrorMessage(data.message || 'Invalid or expired verification code. Please request a new code.');
      }
    } catch {
      setErrorMessage('Network error verifying code.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action 4: Forgot Password Step 1 — Request Reset Code
  // ---------------------------------------------------------------------------
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      if (isSignInLoaded && clerkSignIn) {
        try {
          await clerkSignIn.create({
            strategy: 'reset_password_email_code',
            identifier: email.trim(),
          });
          setForgotStep('reset');
          setResendCooldown(60);
          setInfoMessage(`We sent a 6-digit reset code to ${email}.`);
          success('Reset Code Sent', 'Check your inbox for your security reset code.');
          setLoading(false);
          return;
        } catch (clerkErr: unknown) {
          console.warn('Clerk password reset request warning:', clerkErr);
          const firstErr = (clerkErr as { errors?: Array<{ message?: string; longMessage?: string; code?: string }> })?.errors?.[0];
          if (firstErr?.code !== 'form_identifier_not_found') {
            const msg = firstErr?.longMessage || firstErr?.message;
            if (msg) {
              setErrorMessage(msg);
              setLoading(false);
              return;
            }
          }
        }
      }

      // Fallback
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), type: 'password_reset' }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep('reset');
        setResendCooldown(60);
        setInfoMessage(`We sent a 6-digit reset code to ${email}.`);
        success('Reset Code Sent', 'Check your inbox for your security reset code.');
      } else {
        setErrorMessage(data.message || 'Failed to dispatch reset code.');
      }
    } catch {
      setErrorMessage('Network error while requesting reset code.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action 5: Forgot Password Step 2 — Confirm Code & Set New Password
  // ---------------------------------------------------------------------------
  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit reset code.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      // 1. If Clerk reset is active in session
      if (isSignInLoaded && clerkSignIn && clerkSignIn.status === 'needs_first_factor') {
        try {
          const result = await clerkSignIn.attemptFirstFactor({
            strategy: 'reset_password_email_code',
            code: cleanOtp,
            password: newPassword,
          });

          if (result.status === 'complete' && setSignInActive) {
            await setSignInActive({ session: result.createdSessionId });

            // Sync updated password hash to Cloudflare D1
            await fetch('/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email.trim(), newPassword, clerkVerified: true }),
            }).catch(() => {});

            success('Password Updated', 'Your credentials have been reset. Directing to your destination...');
            navigateToDestination(callbackUrl);
            return;
          }
        } catch (clerkErr: unknown) {
          console.error('Clerk password reset confirm error:', clerkErr);
          const firstErr = (clerkErr as { errors?: Array<{ message?: string; longMessage?: string; code?: string }> })?.errors?.[0];
          const clerkMsg = firstErr?.longMessage || firstErr?.message;
          setErrorMessage(clerkMsg || 'Failed to verify reset code. Please check your code or password.');
          setLoading(false);
          return;
        }
      }

      // 2. Cloudflare D1 fallback verification
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: cleanOtp, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        success('Password Updated', 'Your credentials have been reset. Signing you in...');
        await signIn('credentials', {
          redirect: false,
          email: email.trim(),
          password: newPassword,
        });
        navigateToDestination(callbackUrl);
      } else {
        if (data.message?.includes('Invalid or expired')) {
          setErrorMessage('Invalid or expired reset code. If your code expired or you refreshed the page, please click "Resend Code" to receive a fresh code.');
        } else {
          setErrorMessage(data.message || 'Failed to reset password.');
        }
      }
    } catch {
      setErrorMessage('Network error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    clearMessages();
    setLoading(true);
    try {
      if (mode === 'register' && isSignUpLoaded && clerkSignUp && clerkSignUp.id) {
        try {
          await clerkSignUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setResendCooldown(60);
          setInfoMessage(`A fresh verification code has been dispatched to ${email}.`);
          success('New Code Dispatched', 'Please check your email.');
          setLoading(false);
          return;
        } catch (clerkErr: unknown) {
          const firstErr = (clerkErr as { errors?: Array<{ message?: string; longMessage?: string }> })?.errors?.[0];
          const errMsg = firstErr?.longMessage || firstErr?.message;
          if (errMsg) {
            setErrorMessage(errMsg);
            setLoading(false);
            return;
          }
        }
      }

      if (mode === 'forgot' && isSignInLoaded && clerkSignIn) {
        try {
          await clerkSignIn.create({
            strategy: 'reset_password_email_code',
            identifier: email.trim(),
          });
          setResendCooldown(60);
          setInfoMessage(`A fresh 6-digit reset code has been dispatched to ${email}.`);
          success('New Code Dispatched', 'Please check your inbox.');
          setLoading(false);
          return;
        } catch {}
      }

      const type = mode === 'register' ? 'signup_otp' : 'password_reset';
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name, type }),
      });
      const data = await res.json();
      if (data.success) {
        setResendCooldown(60);
        setInfoMessage('A fresh verification code has been dispatched.');
        success('New Code Dispatched', 'Please check your email.');
      } else {
        setErrorMessage(data.message || 'Failed to resend code.');
      }
    } catch {
      setErrorMessage('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-block">
          <span className="font-serif text-3xl font-bold tracking-[0.25em] text-[#0C1427] uppercase">
            Shipfold
          </span>
          <span className="block text-[9px] uppercase tracking-[0.35em] text-[#C5A880] font-medium -mt-0.5">
            Atelier &amp; Clothiers
          </span>
        </Link>
        <h2 className="font-serif text-xl font-medium text-zinc-900 mt-2">
          {mode === 'login'
            ? 'Patron Salon Login'
            : mode === 'register'
            ? 'Join The Shipfold Circle'
            : 'Recover Access'}
        </h2>
        {callbackUrl.includes('/checkout') && (
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Please authenticate your patron account to proceed to secure checkout.
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-zinc-200 shadow-xl space-y-6">
          {/* Mode Switcher Tabs (Login vs Register) */}
          {mode !== 'forgot' && (
            <div className="flex border-b border-zinc-200 text-xs uppercase tracking-widest font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setRegisterStep('input');
                  clearMessages();
                }}
                className={`flex-1 pb-3 text-center transition-colors relative ${
                  mode === 'login'
                    ? 'text-[#0C1427] after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-[#0C1427]'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  clearMessages();
                }}
                className={`flex-1 pb-3 text-center transition-colors relative ${
                  mode === 'register'
                    ? 'text-[#0C1427] after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-[#0C1427]'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-[#FAF8F5] border border-[#C5A880]/60 text-zinc-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C5A880]" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 1: SIGN IN                                                 */}
          {/* =============================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Patron Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@shipfold.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep('request');
                      clearMessages();
                    }}
                    className="text-[11px] text-[#8B6B38] hover:text-[#0C1427] font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Patron Salon'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-white px-2.5 text-zinc-400 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF8F5] border border-zinc-300 hover:border-[#0C1427] text-zinc-800 text-xs font-medium transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* =============================================================== */}
          {/* VIEW 2: SIGN UP STEP 1 — Enter Credentials                      */}
          {/* =============================================================== */}
          {mode === 'register' && registerStep === 'input' && (
            <form onSubmit={handleSendSignupOtp} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Patron Email Address (For Verification)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@shipfold.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  A 6-digit verification code will be sent to confirm your email.
                </p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Dispatching Code...' : 'Send Verification Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-white px-2.5 text-zinc-400 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF8F5] border border-zinc-300 hover:border-[#0C1427] text-zinc-800 text-xs font-medium transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>
            </form>
          )}

          {/* =============================================================== */}
          {/* VIEW 2: SIGN UP STEP 2 — Enter 6-Digit Email OTP                */}
          {/* =============================================================== */}
          {mode === 'register' && registerStep === 'verify_otp' && (
            <form onSubmit={handleVerifySignupOtp} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C5A880] text-[#0C1427] mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#8B6B38]" />
                </div>
                <h3 className="font-serif text-base font-medium text-zinc-900">
                  Enter 6-Digit Verification Code
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Sent to <strong className="text-zinc-800">{email}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  autoFocus
                  className="w-full text-center text-2xl font-mono tracking-[0.4em] py-3 bg-[#FAF8F5] border-2 border-[#0C1427] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Enter Atelier'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setRegisterStep('input')}
                  className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Change details
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-[#8B6B38] hover:text-[#0C1427] font-semibold disabled:text-zinc-400 transition-colors"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {/* =============================================================== */}
          {/* VIEW 3: FORGOT PASSWORD                                         */}
          {/* =============================================================== */}
          {mode === 'forgot' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearMessages();
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8B6B38]">
                  Password Recovery
                </span>
              </div>

              {forgotStep === 'request' ? (
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-700 mx-auto flex items-center justify-center mb-1">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-base font-medium text-zinc-900">
                      Reset Your Password
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Enter your patron email to receive a 6-digit security code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      Patron Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patron@shipfold.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <span>{loading ? 'Sending Code...' : 'Send Security Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="font-serif text-base font-medium text-zinc-900">
                      Set New Password
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Code sent to <strong className="text-zinc-800">{email}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center text-xl font-mono tracking-[0.3em] py-2.5 bg-[#FAF8F5] border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6 || newPassword.length < 6}
                    className="w-full py-3 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <span>{loading ? 'Updating...' : 'Update Password & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="text-xs text-[#8B6B38] hover:text-[#0C1427] font-semibold disabled:text-zinc-400 transition-colors"
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Return link */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-center text-[11px] text-zinc-500">
            <Link href="/" className="hover:text-black luxury-link">
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
