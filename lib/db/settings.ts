/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — STORE & SHIPPING SETTINGS
 * ==============================================================================
 */

import { db } from './client';

export interface ShippingSettings {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number; // In INR (e.g. 0 for always free, or 999)
  standardShippingFee: number;   // In INR (e.g. 150)
  shippingNotice: string;        // Announcement text shown across site
  freeShippingAllOrders?: boolean;
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  freeShippingEnabled: true,
  freeShippingThreshold: 0,
  standardShippingFee: 0,
  shippingNotice: 'Free Delivery on all orders nationwide.',
  freeShippingAllOrders: true,
};

let memorySettingsCache: ShippingSettings | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 15000;

async function ensureSettingsTable(): Promise<void> {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS store_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (err) {
    console.warn('[D1 Store Settings Table Warning]:', err);
  }
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  const now = Date.now();
  if (memorySettingsCache && now - lastCacheTime < CACHE_TTL_MS) {
    return memorySettingsCache;
  }

  try {
    await ensureSettingsTable();
    const row = await db.prepare('SELECT value FROM store_settings WHERE key = ?')
      .bind('shipping')
      .first<{ value: string }>();

    if (row && row.value) {
      const parsed = JSON.parse(row.value) as Partial<ShippingSettings>;
      const settings: ShippingSettings = {
        freeShippingEnabled: parsed.freeShippingEnabled ?? DEFAULT_SHIPPING_SETTINGS.freeShippingEnabled,
        freeShippingThreshold: Number(parsed.freeShippingThreshold ?? DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold),
        standardShippingFee: Number(parsed.standardShippingFee ?? DEFAULT_SHIPPING_SETTINGS.standardShippingFee),
        shippingNotice: parsed.shippingNotice || DEFAULT_SHIPPING_SETTINGS.shippingNotice,
        freeShippingAllOrders: parsed.freeShippingAllOrders ?? (parsed.freeShippingEnabled && (parsed.freeShippingThreshold ?? 999) <= 0),
      };
      memorySettingsCache = settings;
      lastCacheTime = now;
      return settings;
    }
  } catch (err) {
    console.warn('[D1 Get Shipping Settings Warning]:', err);
  }

  return DEFAULT_SHIPPING_SETTINGS;
}

export async function updateShippingSettings(newSettings: Partial<ShippingSettings>): Promise<ShippingSettings> {
  const current = await getShippingSettings();
  const updated: ShippingSettings = {
    ...current,
    ...newSettings,
    freeShippingEnabled: newSettings.freeShippingEnabled ?? current.freeShippingEnabled,
    freeShippingThreshold: Number(newSettings.freeShippingThreshold ?? current.freeShippingThreshold),
    standardShippingFee: Number(newSettings.standardShippingFee ?? current.standardShippingFee),
    shippingNotice: newSettings.shippingNotice ?? current.shippingNotice,
    freeShippingAllOrders: newSettings.freeShippingAllOrders ?? (
      (newSettings.freeShippingEnabled ?? current.freeShippingEnabled) &&
      Number(newSettings.freeShippingThreshold ?? current.freeShippingThreshold) <= 0
    ),
  };

  try {
    await ensureSettingsTable();
    const jsonValue = JSON.stringify(updated);

    await db.prepare(`
      INSERT INTO store_settings (key, value, updated_at)
      VALUES ('shipping', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `).bind(jsonValue).run();

    memorySettingsCache = updated;
    lastCacheTime = Date.now();
    return updated;
  } catch (err) {
    console.error('[D1 Update Shipping Settings Error]:', err);
    memorySettingsCache = updated;
    return updated;
  }
}

export function calculateShippingFee(netSubtotal: number, settings: ShippingSettings): number {
  if (netSubtotal <= 0) return 0;

  if (settings.freeShippingEnabled) {
    if (settings.freeShippingAllOrders || settings.freeShippingThreshold <= 0) {
      return 0;
    }
    if (netSubtotal >= settings.freeShippingThreshold) {
      return 0;
    }
  }

  return Math.max(0, settings.standardShippingFee);
}
