/**
 * ==============================================================================
 * SHIPFOLD ATELIER — DATABASE RE-EXPORT SHIM
 * ==============================================================================
 * 
 * Cloudflare D1 is now the sole primary database and single source of truth.
 * All database logic is modularized in '@/lib/db/*'.
 * 
 * This file preserves backward-compatibility for existing imports (@/lib/db).
 * ==============================================================================
 */

export * from './db/index';
