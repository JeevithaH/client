/**
 * Shipfold Security Audit Logger
 * Strictly redacts sensitive credentials (passwords, tokens, keys, card details)
 * Logs security events with structured timestamps and context.
 */

type SecurityEventType =
  | 'AUTH_FAILURE'
  | 'AUTH_SUCCESS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_ACCESS'
  | 'ADMIN_ACCESS_ATTEMPT'
  | 'ADMIN_ACTION'
  | 'PRICE_TAMPER_ATTEMPT'
  | 'COUPON_ABUSE_ATTEMPT'
  | 'PAYMENT_VERIFY_FAILURE'
  | 'PAYMENT_VERIFY_SUCCESS'
  | 'IDOR_ATTEMPT'
  | 'CSRF_FAILURE'
  | 'SUSPICIOUS_INPUT';

interface SecurityLogContext {
  ip?: string;
  userId?: string;
  endpoint?: string;
  method?: string;
  details?: Record<string, unknown>;
}

const REDACTED_KEYS = new Set([
  'password',
  'password_hash',
  'token',
  'accesstoken',
  'refreshtoken',
  'secret',
  'key',
  'apikey',
  'service_role',
  'card',
  'cvv',
  'authorization',
  'cookie',
]);

function sanitizeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z]/g, '');
    if (REDACTED_KEYS.has(lowerKey) || lowerKey.includes('password') || lowerKey.includes('secret') || lowerKey.includes('token')) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function logSecurityEvent(
  event: SecurityEventType,
  message: string,
  context?: SecurityLogContext
) {
  const timestamp = new Date().toISOString();
  const safeContext = context ? (sanitizeData(context) as SecurityLogContext) : {};

  const logPayload = {
    timestamp,
    level: 'SECURITY_AUDIT',
    event,
    message,
    ...safeContext,
  };

  if (process.env.NODE_ENV !== 'production' || event.includes('FAILURE') || event.includes('ATTEMPT') || event.includes('EXCEEDED')) {
    console.warn(`[SECURITY][${event}] ${message}`, JSON.stringify(logPayload));
  } else {
    console.log(`[SECURITY][${event}] ${message}`);
  }
}
