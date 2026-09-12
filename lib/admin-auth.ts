import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from './auth';
import { getAuthenticatedUser } from './clerk-auth';
import { logSecurityEvent } from './logger';
import { checkRateLimit, rateLimitResponse, RATE_LIMIT_PRESETS } from './rate-limit';

export async function verifyAdminSession(req?: NextRequest) {
  if (req) {
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.ADMIN);
    if (!rateLimit.allowed) {
      return {
        authorized: false,
        response: rateLimitResponse(rateLimit),
      };
    }
  }

  // 1. Check Clerk / Supabase Auth session first
  const authUser = await getAuthenticatedUser(req);
  if (authUser) {
    if (authUser.role === 'admin') {
      return {
        authorized: true,
        user: authUser,
      };
    }
    logSecurityEvent('ADMIN_ACCESS_ATTEMPT', 'Non-admin attempted admin action via Clerk/Supabase', {
      userId: authUser.id,
      endpoint: req?.nextUrl.pathname,
    });
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Administrative privilege required' },
        { status: 403 }
      ),
    };
  }

  // 2. Fallback to NextAuth session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  const role = (session.user as unknown as { role?: string }).role;
  if (role !== 'admin') {
    logSecurityEvent('ADMIN_ACCESS_ATTEMPT', 'Non-admin attempted admin action via session', {
      userId: (session.user as any).id,
      endpoint: req?.nextUrl.pathname,
    });
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Administrative privilege required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}
