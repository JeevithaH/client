import { NextRequest, NextResponse } from 'next/server';
import { getUserAddresses, saveAddress } from '@/lib/db';
import { Address } from '@/lib/types';
import { checkRateLimit, rateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import {
  parseSafeJson,
  sanitizeString,
  safeErrorResponse,
  unauthorizedResponse,
  validateRequestOrigin,
} from '@/lib/security';
import { getAuthenticatedUser } from '@/lib/clerk-auth';
import { logSecurityEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.PUBLIC_API);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // Spec 8 & 9: Strictly enforce authentication and bind to session user ID
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return unauthorizedResponse('Authentication required to view saved addresses');
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // Only admin may query other users' addresses
    let targetUserId = authUser.id;
    if (requestedUserId && authUser.role === 'admin') {
      targetUserId = requestedUserId;
    }

    const addresses = await getUserAddresses(targetUserId);
    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error('[API Addresses GET] Error:', error);
    return safeErrorResponse('Failed to fetch addresses', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.PUBLIC_API);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    if (!validateRequestOrigin(req)) {
      return safeErrorResponse('Forbidden: Invalid request origin', 403);
    }

    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return unauthorizedResponse('Authentication required to save addresses');
    }

    const { data: body, error: jsonError } = await parseSafeJson<{
      id?: string;
      fullName?: string;
      phone?: string;
      street?: string;
      apartment?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      isDefault?: boolean;
    }>(req);

    if (jsonError || !body) {
      return safeErrorResponse('Invalid address data', 400);
    }

    const {
      fullName,
      phone,
      street,
      apartment,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = body;

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      return safeErrorResponse('Please fill in all required address fields', 400);
    }

    // Spec 9: User ID is bound to the authenticated session, never trusted from client
    const newAddress: Address = {
      id: body.id || `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: authUser.id,
      full_name: sanitizeString(fullName),
      phone: sanitizeString(phone),
      street: sanitizeString(street),
      apartment: apartment ? sanitizeString(apartment) : '',
      city: sanitizeString(city),
      state: sanitizeString(state),
      postal_code: sanitizeString(postalCode),
      country: country ? sanitizeString(country) : 'India',
      is_default: Boolean(isDefault),
    };

    const saved = await saveAddress(newAddress);
    return NextResponse.json({ success: true, address: saved });
  } catch (error) {
    console.error('[API Addresses POST] Error:', error);
    return safeErrorResponse('Failed to save address', 500);
  }
}
