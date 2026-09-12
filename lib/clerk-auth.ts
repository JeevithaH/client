import { NextRequest, NextResponse } from 'next/server';
import { auth as clerkAuth, currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { getUserByEmail, createUser } from '@/lib/db';
import { User } from '@/lib/types';
import { logSecurityEvent } from '@/lib/logger';
import { unauthorizedResponse, forbiddenResponse } from '@/lib/security';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: 'customer' | 'admin';
  source: 'clerk' | 'session';
}

/**
 * Validates the authenticated user from Clerk (or NextAuth fallback).
 * Never trusts any client-supplied userId or role header.
 * Synchronizes new Clerk patrons directly into Cloudflare D1.
 */
export async function getAuthenticatedUser(req?: NextRequest): Promise<AuthenticatedUser | null> {
  // 1. Check Clerk Auth
  try {
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (clerkKey && !clerkKey.includes('placeholder')) {
      const { userId, sessionClaims } = clerkAuth();
      if (userId) {
        // Retrieve email and name from sessionClaims or clerkCurrentUser
        let email =
          ((sessionClaims as Record<string, unknown>)?.email as string) ||
          ((sessionClaims as Record<string, unknown>)?.primary_email as string) ||
          '';
        let name =
          ((sessionClaims as Record<string, unknown>)?.name as string) ||
          ((sessionClaims as Record<string, unknown>)?.full_name as string) ||
          '';

        if (!email) {
          try {
            const clerkUser = await clerkCurrentUser();
            if (clerkUser) {
              email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
              name = name || [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'Patron';
            }
          } catch (err) {
            console.warn('[Clerk current user lookup warning]:', err);
          }
        }

        const safeEmail = (email || `${userId}@clerk.user`).toLowerCase().trim();
        let localUser: User | null = await getUserByEmail(safeEmail);

        // Sync new patron to Cloudflare D1
        if (!localUser) {
          try {
            localUser = await createUser({
              id: userId,
              name: name || 'Patron',
              email: safeEmail,
              password: 'clerk_authenticated_patron',
            });
          } catch {
            // User may already exist with ID
          }
        }

        const isAdminEmail =
          safeEmail === (process.env.ADMIN_EMAIL || 'test@gmail.com').toLowerCase() ||
          safeEmail === 'jeevithah648@gmail.com';
        const role =
          localUser?.role === 'admin' ||
          (sessionClaims as Record<string, unknown>)?.public_metadata === 'admin' ||
          isAdminEmail
            ? 'admin'
            : 'customer';

        return {
          id: localUser?.id || userId,
          email: safeEmail,
          name: localUser?.name || name || 'Patron',
          role,
          source: 'clerk',
        };
      }
    }
  } catch (err) {
    console.error('[Clerk getAuthenticatedUser error]:', err);
  }

  // 2. Fallback to NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
      const dbUser = await getUserByEmail(session.user.email);
      const role =
        (session.user as unknown as { role?: string })?.role === 'admin' || dbUser?.role === 'admin'
          ? 'admin'
          : 'customer';

      return {
        id: (session.user as unknown as { id?: string })?.id || dbUser?.id || 'session-user',
        email: session.user.email,
        name: session.user.name || dbUser?.name || 'Patron',
        role,
        source: 'session',
      };
    }
  } catch (err) {
    console.warn('[Session fallback lookup notice]:', err);
  }

  return null;
}

/**
 * Guard for protected user endpoints. Returns AuthenticatedUser or 401 response.
 */
export async function enforceAuth(req: NextRequest): Promise<{ user: AuthenticatedUser } | { response: NextResponse }> {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    logSecurityEvent('UNAUTHORIZED_ACCESS', 'Unauthenticated request to protected endpoint', {
      endpoint: req.nextUrl.pathname,
      method: req.method,
    });
    return { response: unauthorizedResponse('Authentication required to access this resource') };
  }
  return { user };
}

/**
 * Guard for protected admin endpoints. Returns AuthenticatedUser or 401/403 response.
 */
export async function enforceAdmin(req: NextRequest): Promise<{ user: AuthenticatedUser } | { response: NextResponse }> {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    logSecurityEvent('ADMIN_ACCESS_ATTEMPT', 'Unauthenticated attempt to access admin endpoint', {
      endpoint: req.nextUrl.pathname,
      method: req.method,
    });
    return { response: unauthorizedResponse('Authentication required') };
  }

  if (user.role !== 'admin') {
    logSecurityEvent('ADMIN_ACCESS_ATTEMPT', 'Non-admin user attempted to access admin endpoint', {
      userId: user.id,
      endpoint: req.nextUrl.pathname,
      method: req.method,
    });
    return { response: forbiddenResponse('Admin authorization required') };
  }

  return { user };
}
