/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — STOREFRONT PLACEMENTS
 * ==============================================================================
 */

import { db } from './client';
import { Placement, PlacementSlot } from '../types';

interface DbPlacementRow {
  id: string;
  slot_key: string;
  title?: string;
  subtitle?: string;
  badge_text?: string;
  image_url: string;
  link_url?: string;
  cta_text?: string;
  is_active: number | boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Retrieves all promotional placements for Nirvigna Studio management.
 */
export async function getAllPlacementsAdmin(): Promise<Placement[]> {
  try {
    const res = await db
      .prepare('SELECT * FROM placements ORDER BY display_order ASC, created_at DESC')
      .all<DbPlacementRow>();

    return (res.results || []).map((r) => ({
      ...r,
      slot_key: r.slot_key as PlacementSlot,
      is_active: Boolean(r.is_active),
    }));
  } catch (err) {
    console.error('[D1 getAllPlacementsAdmin Error]:', err);
    return [];
  }
}

/**
 * Retrieves all active promotional placements sorted by display order for the storefront.
 */
export async function getActivePlacements(): Promise<Placement[]> {
  try {
    const res = await db
      .prepare('SELECT * FROM placements WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC')
      .all<DbPlacementRow>();

    if (res.results && res.results.length > 0) {
      return res.results.map((r) => ({
        ...r,
        slot_key: r.slot_key as PlacementSlot,
        is_active: true,
      }));
    }
  } catch (err) {
    console.warn('[D1 getActivePlacements Warning]:', err);
  }

  // Fallback defaults
  return [
    {
      id: 'place-hero-default',
      slot_key: 'hero_banner',
      title: 'The Art of the Luxury T-Shirt',
      subtitle:
        'Engineered from American Supima® and double-mercerized Egyptian cotton. Pure lines, sculptural drape, and enduring softness.',
      badge_text: 'Spring - Summer 2026 Collection',
      image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2200&auto=format&fit=crop',
      link_url: '/shop',
      cta_text: 'Explore Collection',
      is_active: true,
      display_order: 1,
    },
    {
      id: 'place-ad-campaign',
      slot_key: 'home_ad_campaign',
      title: 'The Sovereign Knitwear Campaign',
      subtitle:
        'Tailored in Italy & Bengaluru using double-mercerized 60s count Egyptian yarns for peerless luster and breathability.',
      badge_text: 'Haute Confection 2026',
      image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop',
      link_url: '/shop?category=polos',
      cta_text: 'Discover Tailored Polos',
      is_active: true,
      display_order: 2,
    },
    {
      id: 'place-ad-strip',
      slot_key: 'home_ad_strip',
      title: 'Private Salon & Privilege Access',
      subtitle:
        'Patrons receive complimentary white-glove doorstep delivery and 10% inaugural privilege savings with voucher code SHIP10.',
      badge_text: 'The Shipfold Circle',
      image_url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1600&auto=format&fit=crop',
      link_url: '/shop',
      cta_text: 'Join The Circle',
      is_active: true,
      display_order: 3,
    },
  ];
}

/**
 * Retrieves the active banner or campaign placement for a specific storefront slot.
 */
export async function getActivePlacementBySlot(slotKey: string): Promise<Placement | null> {
  const placements = await getActivePlacements();
  return placements.find((p) => p.slot_key === slotKey) || null;
}

/**
 * Creates or updates an editorial campaign placement in Cloudflare D1.
 */
export async function savePlacement(
  data: Partial<Placement> & { slot_key: PlacementSlot; image_url: string }
): Promise<Placement> {
  const id = data.id || `place_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const title = data.title || '';
  const subtitle = data.subtitle || '';
  const badgeText = data.badge_text || '';
  const linkUrl = data.link_url || '/shop';
  const ctaText = data.cta_text || 'Discover Collection';
  const isActive = data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1;
  const displayOrder = data.display_order ?? 0;

  await db
    .prepare(
      `INSERT OR REPLACE INTO placements (
        id, slot_key, title, subtitle, badge_text, image_url, link_url, cta_text, is_active, display_order, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    )
    .bind(
      id,
      data.slot_key,
      title,
      subtitle,
      badgeText,
      data.image_url,
      linkUrl,
      ctaText,
      isActive,
      displayOrder
    )
    .run();

  return {
    id,
    slot_key: data.slot_key,
    title,
    subtitle,
    badge_text: badgeText,
    image_url: data.image_url,
    link_url: linkUrl,
    cta_text: ctaText,
    is_active: Boolean(isActive),
    display_order: displayOrder,
  };
}

/**
 * Permanently deletes a promotional placement from Cloudflare D1.
 */
export async function deletePlacement(id: string): Promise<boolean> {
  await db.prepare('DELETE FROM placements WHERE id = ?').bind(id).run();
  return true;
}

/**
 * Toggles the visibility of a placement on the live storefront in Cloudflare D1.
 */
export async function togglePlacementActive(id: string, isActive: boolean): Promise<boolean> {
  await db
    .prepare('UPDATE placements SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(isActive ? 1 : 0, id)
    .run();
  return true;
}
