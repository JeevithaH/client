/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — CATEGORIES
 * ==============================================================================
 */

import { db } from './client';
import { Category } from '../types';
import { SEED_CATEGORIES } from '../seed-data';

/**
 * Retrieves all categories ordered by display order.
 * Queries Cloudflare D1 directly; falls back to seed data if remote table is uninitialized.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all<Category>();
    if (res.success && res.results && res.results.length > 0) {
      return res.results;
    }
  } catch (err) {
    console.warn('[D1 Categories Warning]:', err);
  }
  return SEED_CATEGORIES;
}
