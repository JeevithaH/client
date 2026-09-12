import { NextRequest, NextResponse } from 'next/server';
import { logSecurityEvent } from './logger';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Global in-memory storage for sliding window rate limits
const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup stale keys every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of Array.from(memoryStore.entries())) {
      if (record.resetTime <= now) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  return '127.0.0.1';
}

export interface RateLimitOptions {
  limit: number; // Max allowed requests
  windowSeconds: number; // Time window in seconds
  identifier?: string; // Optional user or action identifier (in addition to IP)
  endpointName?: string; // Descriptive name for audit logging
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and updates rate limit for a request.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(req);
  const prefix = options.endpointName || 'general';
  const customId = options.identifier ? `:${options.identifier}` : '';
  const key = `${prefix}:${ip}${customId}`;

  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  let record = memoryStore.get(key);

  if (!record || record.resetTime <= now) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    memoryStore.set(key, record);
    return {
      allowed: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  record.count += 1;
  const remaining = Math.max(0, options.limit - record.count);
  const resetSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

  if (record.count > options.limit) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', `Rate limit exceeded on ${prefix}`, {
      ip,
      endpoint: req.nextUrl.pathname,
      method: req.method,
      details: {
        limit: options.limit,
        windowSeconds: options.windowSeconds,
        count: record.count,
      },
    });

    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      resetSeconds,
    };
  }

  return {
    allowed: true,
    limit: options.limit,
    remaining,
    resetSeconds,
  };
}

/**
 * Returns a standardized 429 Too Many Requests response with appropriate headers.
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: 'Too many requests. Please slow down and try again later.',
      retryAfter: result.resetSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': result.resetSeconds.toString(),
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
      },
    }
  );
}

// Preset rate limit configurations
export const RATE_LIMIT_PRESETS = {
  // Spec 1 & 16: Stricter rate limits for login, signup, OTP, password reset
  AUTH: { limit: 5, windowSeconds: 60, endpointName: 'auth' },
  OTP: { limit: 3, windowSeconds: 60, endpointName: 'otp' },
  PASSWORD_RESET: { limit: 3, windowSeconds: 60, endpointName: 'pwd_reset' },
  
  // Checkout, coupon validation, order creation
  CHECKOUT: { limit: 10, windowSeconds: 60, endpointName: 'checkout' },
  ORDERS: { limit: 10, windowSeconds: 60, endpointName: 'orders' },
  COUPONS: { limit: 10, windowSeconds: 60, endpointName: 'coupons' },
  
  // Upload and administrative actions
  UPLOAD: { limit: 10, windowSeconds: 60, endpointName: 'upload' },
  ADMIN: { limit: 30, windowSeconds: 60, endpointName: 'admin' },
  
  // General public read-only APIs
  PUBLIC_API: { limit: 60, windowSeconds: 60, endpointName: 'public_api' },
};
