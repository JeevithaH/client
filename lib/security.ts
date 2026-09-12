import { NextRequest, NextResponse } from 'next/server';
import { logSecurityEvent } from './logger';

/**
 * Standard security response helpers to prevent information leakage
 */
export function safeErrorResponse(
  message: string = 'Invalid request',
  status: number = 400
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export function unauthorizedResponse(
  message: string = 'Authentication required'
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 401 }
  );
}

export function forbiddenResponse(
  message: string = 'Access forbidden'
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 403 }
  );
}

/**
 * Validates request Content-Type is application/json
 */
export function validateJsonContentType(req: NextRequest): boolean {
  const contentType = req.headers.get('content-type');
  if (!contentType) return false;
  return contentType.toLowerCase().includes('application/json');
}

/**
 * Parses and validates request body with size limits (default 1MB)
 */
export async function parseSafeJson<T = Record<string, unknown>>(
  req: NextRequest,
  maxSizeBytes: number = 1024 * 1024
): Promise<{ data: T | null; error: string | null }> {
  try {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      logSecurityEvent('SUSPICIOUS_INPUT', 'Payload too large', {
        endpoint: req.nextUrl.pathname,
        method: req.method,
        details: { contentLength, maxSizeBytes },
      });
      return { data: null, error: 'Payload exceeds maximum permitted size' };
    }

    const text = await req.text();
    if (!text || text.trim() === '') {
      return { data: null, error: 'Request body is empty' };
    }

    if (text.length > maxSizeBytes) {
      return { data: null, error: 'Payload exceeds maximum permitted size' };
    }

    const parsed = JSON.parse(text) as T;
    return { data: parsed, error: null };
  } catch {
    return { data: null, error: 'Malformed JSON payload' };
  }
}

/**
 * Basic XSS sanitization for string fields (HTML entity encoding)
 */
export function sanitizeString(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Checks email validity using RFC 5322 regex
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Validates password complexity
 * At least 8 characters, containing at least one letter and one number
 */
export function isStrongPassword(password: unknown): { valid: boolean; reason?: string } {
  if (typeof password !== 'string') {
    return { valid: false, reason: 'Password must be a string' };
  }
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long' };
  }
  if (password.length > 128) {
    return { valid: false, reason: 'Password must not exceed 128 characters' };
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one letter and one number' };
  }
  return { valid: true };
}

/**
 * Validates positive integers (for quantities, limits)
 */
export function isPositiveInteger(val: unknown, max: number = 1000000): boolean {
  if (typeof val !== 'number' && typeof val !== 'string') return false;
  const num = Number(val);
  return Number.isInteger(num) && num > 0 && num <= max;
}

/**
 * CSRF / Origin Validation for state-changing HTTP requests
 */
export function validateRequestOrigin(req: NextRequest): boolean {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true; // Read-only requests safe from simple CSRF
  }

  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  // In production or when origin is present, check matching host
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      // Allow exact host match or localhost in dev
      if (originUrl.host === host || originUrl.host.includes('localhost')) {
        return true;
      }
      logSecurityEvent('CSRF_FAILURE', 'Origin host mismatch', {
        endpoint: req.nextUrl.pathname,
        method,
        details: { origin, host },
      });
      return false;
    } catch {
      return false;
    }
  }

  // Fallback to referer check if origin header was not sent
  const referer = req.headers.get('referer');
  if (referer && host) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === host || refererUrl.host.includes('localhost')) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // If both origin and referer are absent in a state-changing browser request, allow only in dev or curl
  return process.env.NODE_ENV !== 'production';
}
