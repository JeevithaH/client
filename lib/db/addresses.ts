/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — ADDRESSES
 * ==============================================================================
 */

import { db } from './client';
import { Address } from '../types';

interface DbAddressRow {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: number | boolean;
  created_at?: string;
}

/**
 * Retrieves all saved delivery addresses for a patron from Cloudflare D1.
 */
export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const res = await db
      .prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC')
      .bind(userId)
      .all<DbAddressRow>();

    return (res.results || []).map((r) => ({
      ...r,
      is_default: Boolean(r.is_default),
    }));
  } catch (err) {
    console.error('[D1 getUserAddresses Error]:', err);
    return [];
  }
}

/**
 * Saves or updates a delivery address in Cloudflare D1.
 */
export async function saveAddress(address: Address): Promise<Address> {
  if (address.is_default) {
    await db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').bind(address.user_id).run();
  }

  await db
    .prepare(
      `INSERT OR REPLACE INTO addresses (
        id, user_id, full_name, phone, street, apartment, city, state, postal_code, country, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      address.id,
      address.user_id,
      address.full_name,
      address.phone,
      address.street,
      address.apartment || null,
      address.city,
      address.state,
      address.postal_code,
      address.country || 'India',
      address.is_default ? 1 : 0
    )
    .run();

  return address;
}
