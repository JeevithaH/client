/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — AUTH TOKENS (OTP)
 * ==============================================================================
 */

import { db } from './client';

/**
 * Saves a 6-digit OTP or reset token to Cloudflare D1 with expiration.
 */
export async function saveAuthToken(
  email: string,
  token: string,
  type: 'signup_otp' | 'password_reset',
  ttlMinutes: number = 10
): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const id = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

  // Invalidate previous tokens of same type
  await db.prepare('DELETE FROM auth_tokens WHERE LOWER(email) = ? AND type = ?').bind(cleanEmail, type).run();

  await db
    .prepare(
      `INSERT INTO auth_tokens (id, email, token, type, expires_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(id, cleanEmail, token, type, expiresAt)
    .run();
}

/**
 * Verifies an OTP or token for an email and deletes it if valid.
 */
export async function verifyAuthToken(
  email: string,
  token: string,
  type: 'signup_otp' | 'password_reset'
): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  const record = await db
    .prepare(
      `SELECT * FROM auth_tokens 
       WHERE LOWER(email) = ? AND token = ? AND type = ? AND expires_at > ?`
    )
    .bind(cleanEmail, token.trim(), type, now)
    .first<{ id: string }>();

  if (!record) {
    return false;
  }

  // Consume token so it cannot be reused
  await db.prepare('DELETE FROM auth_tokens WHERE id = ?').bind(record.id).run();

  return true;
}
