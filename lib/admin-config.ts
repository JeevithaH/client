/**
 * ==============================================================================
 * AVIVEKY — ADMIN CREDENTIALS CONFIGURATION
 * ==============================================================================
 * 
 * Purpose:
 *   Provides the single source of truth for administrative credentials
 *   for AVIVEKY admin studio (`/nirvignastudio`).
 * 
 * How to Change Credentials:
 *   1. You can edit the `email` and `password` properties directly in this file.
 *   2. Or set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env.local` / `.env.production`.
 * 
 * Security & Cloud Sync:
 *   On application startup, the database engine checks whether the password or email
 *   in this file has changed. If changed, it automatically re-hashes the password
 *   with bcrypt (10 rounds salt) and updates both local SQLite and Cloudflare D1.
 * ==============================================================================
 */

export interface AdminCredentialsConfig {
  email: string;
  password: string;
  name: string;
  role: 'admin';
}

export const ADMIN_CONFIG: AdminCredentialsConfig = {
  // Director Login Email / Username
  email: process.env.ADMIN_EMAIL || 'admin@aviveky.com',

  // ⬇️ Master Director Password (or override via ADMIN_PASSWORD in .env.local) ⬇️
  password: process.env.ADMIN_PASSWORD || 'aviveky@2026',

  // Display Name in the Studio Atelier
  name: process.env.ADMIN_NAME || 'AVIVEKY Admin',

  // Fixed privilege tier
  role: 'admin',
};
