/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — USERS & PROFILES
 * ==============================================================================
 */

import { db } from './client';
import { User } from '../types';
import bcrypt from 'bcryptjs';
import { ADMIN_CONFIG } from '../admin-config';

/**
 * Retrieves a user record by email for authentication, including password hash.
 */
export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    const user = await db
      .prepare('SELECT * FROM users WHERE LOWER(email) = ?')
      .bind(cleanEmail)
      .first<User & { password_hash: string }>();

    if (user) return user;
  } catch (err) {
    console.warn('[D1 getUserByEmail Warning]:', err);
  }

  // Check admin fallback credentials
  if (cleanEmail === ADMIN_CONFIG.email.toLowerCase()) {
    const adminHash = bcrypt.hashSync(ADMIN_CONFIG.password, 10);
    return {
      id: 'usr-admin-director',
      name: ADMIN_CONFIG.name,
      email: ADMIN_CONFIG.email,
      password_hash: adminHash,
      role: 'admin',
      status: 'active',
    };
  }

  return null;
}

/**
 * Retrieves all registered users and order metrics for the Studio Director dashboard.
 */
export async function getAllUsersAdmin(): Promise<User[]> {
  try {
    const res = await db
      .prepare(
        `SELECT u.id, u.name, u.email, u.role, u.status, u.phone, u.avatar, u.created_at,
                COUNT(o.id) as orders_count,
                COALESCE(SUM(o.total_amount), 0) as total_spent
         FROM users u
         LEFT JOIN orders o ON u.id = o.user_id
         GROUP BY u.id
         ORDER BY u.created_at DESC`
      )
      .all<User>();

    return res.results || [];
  } catch (err) {
    console.error('[D1 getAllUsersAdmin Error]:', err);
    return [];
  }
}

/**
 * Toggles an account status between 'active' and 'banned' in Cloudflare D1.
 */
export async function toggleUserStatus(userId: string, status: 'active' | 'banned'): Promise<boolean> {
  await db.prepare('UPDATE users SET status = ? WHERE id = ?').bind(status, userId).run();
  return true;
}

/**
 * Registers a new customer account with a salted bcrypt password hash directly in Cloudflare D1.
 */
export async function createUser(userData: {
  id: string;
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const passwordHash = bcrypt.hashSync(userData.password, 10);
  const cleanEmail = userData.email.toLowerCase().trim();

  await db
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, 'customer', 'active')`
    )
    .bind(userData.id, userData.name, cleanEmail, passwordHash)
    .run();

  return {
    id: userData.id,
    name: userData.name,
    email: cleanEmail,
    role: 'customer',
    status: 'active',
  };
}

/**
 * Registers a verified customer account with is_verified = 1 directly in Cloudflare D1.
 */
export async function createVerifiedUser(userData: {
  id: string;
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const passwordHash = bcrypt.hashSync(userData.password, 10);
  const cleanEmail = userData.email.toLowerCase().trim();

  await db
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, role, status, is_verified)
       VALUES (?, ?, ?, ?, 'customer', 'active', 1)`
    )
    .bind(userData.id, userData.name, cleanEmail, passwordHash)
    .run();

  return {
    id: userData.id,
    name: userData.name,
    email: cleanEmail,
    role: 'customer',
    status: 'active',
  };
}

/**
 * Updates a user's password hash directly in Cloudflare D1.
 */
export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  const passwordHash = bcrypt.hashSync(newPassword, 10);

  const res = await db
    .prepare('UPDATE users SET password_hash = ? WHERE LOWER(email) = ?')
    .bind(passwordHash, cleanEmail)
    .run();

  return res.success;
}
