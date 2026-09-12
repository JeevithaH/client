/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — COUPONS & DISCOUNTS
 * ==============================================================================
 */

import { db } from './client';
import { Coupon } from '../types';
import { SEED_COUPONS } from '../seed-data';

/**
 * Retrieves all active coupons for storefront display.
 */
export async function getCoupons(): Promise<Coupon[]> {
  try {
    const res = await db.prepare('SELECT * FROM coupons WHERE active = 1 ORDER BY min_order_value ASC').all<Coupon>();
    if (res.success && res.results && res.results.length > 0) {
      return res.results;
    }
  } catch (err) {
    console.warn('[D1 Coupons Warning]:', err);
  }
  return SEED_COUPONS as unknown as Coupon[];
}

/**
 * Retrieves all coupons for the Studio Director administration panel.
 */
export async function getAllCouponsAdmin(): Promise<Coupon[]> {
  try {
    const res = await db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all<Coupon>();
    return res.results || [];
  } catch (err) {
    console.error('[D1 getAllCouponsAdmin Error]:', err);
    return [];
  }
}

/**
 * Retrieves a single coupon by code (case-insensitive) from Cloudflare D1.
 */
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const cleanCode = code.toUpperCase().trim();
  try {
    const coupon = await db
      .prepare('SELECT * FROM coupons WHERE UPPER(code) = ?')
      .bind(cleanCode)
      .first<Coupon>();
    if (coupon) return coupon;
  } catch (err) {
    console.warn('[D1 getCouponByCode Error]:', err);
  }

  // Fallback to seed coupons if remote not yet seeded
  const fallback = (SEED_COUPONS as unknown as Coupon[]).find((c) => c.code.toUpperCase() === cleanCode);
  return fallback || null;
}

/**
 * Validates a coupon code during checkout, verifying status, expiry, spend, and limits.
 */
export async function validateCouponForCheckout(
  code: string,
  subtotal: number,
  userId?: string
): Promise<{ valid: boolean; message: string; discountAmount?: number; coupon?: Coupon }> {
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }

  if (!coupon.active) {
    return { valid: false, message: 'This coupon is no longer active' };
  }

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { valid: false, message: 'This coupon has expired' };
  }

  if (subtotal < coupon.min_order_value) {
    return {
      valid: false,
      message: `Requires a minimum purchase of ₹${coupon.min_order_value.toLocaleString('en-IN')}`,
    };
  }

  if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
    return { valid: false, message: 'This coupon has reached its maximum redemptions' };
  }

  if (userId && coupon.per_user_limit > 0) {
    const usageRes = await db
      .prepare('SELECT COUNT(*) as count FROM coupon_usages WHERE coupon_id = ? AND user_id = ?')
      .bind(coupon.id, userId)
      .first<{ count: number }>();

    if (usageRes && usageRes.count >= coupon.per_user_limit) {
      return {
        valid: false,
        message: `You have already redeemed this coupon the maximum allowed times (${coupon.per_user_limit})`,
      };
    }
  }

  let discountAmount = 0;
  if (coupon.discount_type === 'percent' || coupon.discount_percent > 0) {
    discountAmount = Math.round((subtotal * coupon.discount_percent) / 100);
  } else {
    discountAmount = Math.min(coupon.discount_amount, subtotal);
  }

  return {
    valid: true,
    coupon,
    discountAmount,
    message: `Coupon '${coupon.code}' applied successfully!`,
  };
}

/**
 * Creates or updates a coupon in Cloudflare D1.
 */
export async function saveCoupon(coupon: Coupon): Promise<Coupon> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO coupons (
        id, code, discount_type, discount_percent, discount_amount, min_order_value,
        usage_limit, per_user_limit, times_used, expires_at, active, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      coupon.id,
      coupon.code.toUpperCase().trim(),
      coupon.discount_type || 'percent',
      coupon.discount_percent || 0,
      coupon.discount_amount || 0,
      coupon.min_order_value || 0,
      coupon.usage_limit || null,
      coupon.per_user_limit || 1,
      coupon.times_used || 0,
      coupon.expires_at || null,
      coupon.active ? 1 : 0,
      coupon.description || ''
    )
    .run();

  return coupon;
}

/**
 * Deletes a coupon from Cloudflare D1.
 */
export async function deleteCoupon(id: string): Promise<boolean> {
  await db.prepare('DELETE FROM coupons WHERE id = ?').bind(id).run();
  return true;
}
