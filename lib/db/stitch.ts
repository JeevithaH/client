import { db } from './client';
import {
  HeroSlide,
  AnnouncementMessage,
  MarqueeItem,
  TrustPillar,
  SocialProofNotification,
  SiteSettings
} from '../types';

// ==============================================================================
// 1. HERO SLIDES
// ==============================================================================

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY display_order ASC')
      .all<HeroSlide>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get Active Hero Slides Warning]:', err);
    return [];
  }
}

export async function getAllHeroSlidesAdmin(): Promise<HeroSlide[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM hero_slides ORDER BY display_order ASC')
      .all<HeroSlide>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get All Hero Slides Warning]:', err);
    return [];
  }
}

export async function saveHeroSlide(slide: Partial<HeroSlide>): Promise<boolean> {
  try {
    const id = slide.id || `slide_${Date.now()}`;
    await db
      .prepare(
        `INSERT INTO hero_slides (id, title, subtitle, badge_text, image_url, mobile_image_url, button_text, button_link, text_alignment, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           subtitle = excluded.subtitle,
           badge_text = excluded.badge_text,
           image_url = excluded.image_url,
           mobile_image_url = excluded.mobile_image_url,
           button_text = excluded.button_text,
           button_link = excluded.button_link,
           text_alignment = excluded.text_alignment,
           display_order = excluded.display_order,
           is_active = excluded.is_active;`
      )
      .bind(
        id,
        slide.title || 'Collection Drop',
        slide.subtitle || '',
        slide.badge_text || '',
        slide.image_url || '',
        slide.mobile_image_url || null,
        slide.button_text || 'Shop Collection',
        slide.button_link || '/collections/all',
        slide.text_alignment || 'left',
        slide.display_order ?? 0,
        slide.is_active ? 1 : 0
      )
      .run();
    return true;
  } catch (err) {
    console.error('[D1 Save Hero Slide Error]:', err);
    return false;
  }
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  try {
    await db.prepare('DELETE FROM hero_slides WHERE id = ?').bind(id).run();
    return true;
  } catch (err) {
    console.error('[D1 Delete Hero Slide Error]:', err);
    return false;
  }
}

// ==============================================================================
// 2. ANNOUNCEMENT MESSAGES
// ==============================================================================

export async function getActiveAnnouncements(): Promise<AnnouncementMessage[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM announcement_messages WHERE is_active = 1 ORDER BY display_order ASC')
      .all<AnnouncementMessage>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get Announcements Warning]:', err);
    return [];
  }
}

export async function getAllAnnouncementsAdmin(): Promise<AnnouncementMessage[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM announcement_messages ORDER BY display_order ASC')
      .all<AnnouncementMessage>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get All Announcements Warning]:', err);
    return [];
  }
}

export async function saveAnnouncement(ann: Partial<AnnouncementMessage>): Promise<boolean> {
  try {
    const id = ann.id || `ann_${Date.now()}`;
    await db
      .prepare(
        `INSERT INTO announcement_messages (id, message, link_url, display_order, is_active)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           message = excluded.message,
           link_url = excluded.link_url,
           display_order = excluded.display_order,
           is_active = excluded.is_active;`
      )
      .bind(
        id,
        ann.message || '',
        ann.link_url || null,
        ann.display_order ?? 0,
        ann.is_active ? 1 : 0
      )
      .run();
    return true;
  } catch (err) {
    console.error('[D1 Save Announcement Error]:', err);
    return false;
  }
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    await db.prepare('DELETE FROM announcement_messages WHERE id = ?').bind(id).run();
    return true;
  } catch (err) {
    console.error('[D1 Delete Announcement Error]:', err);
    return false;
  }
}

// ==============================================================================
// 3. MARQUEE ITEMS
// ==============================================================================

export async function getActiveMarqueeItems(): Promise<MarqueeItem[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM marquee_items WHERE is_active = 1 ORDER BY display_order ASC')
      .all<MarqueeItem>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get Marquee Items Warning]:', err);
    return [];
  }
}

export async function getAllMarqueeItemsAdmin(): Promise<MarqueeItem[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM marquee_items ORDER BY display_order ASC')
      .all<MarqueeItem>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get All Marquee Items Warning]:', err);
    return [];
  }
}

export async function saveMarqueeItem(item: Partial<MarqueeItem>): Promise<boolean> {
  try {
    const id = item.id || `marq_${Date.now()}`;
    await db
      .prepare(
        `INSERT INTO marquee_items (id, text, icon_name, display_order, is_active)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           text = excluded.text,
           icon_name = excluded.icon_name,
           display_order = excluded.display_order,
           is_active = excluded.is_active;`
      )
      .bind(
        id,
        item.text || '',
        item.icon_name || 'Sparkles',
        item.display_order ?? 0,
        item.is_active ? 1 : 0
      )
      .run();
    return true;
  } catch (err) {
    console.error('[D1 Save Marquee Item Error]:', err);
    return false;
  }
}

export async function deleteMarqueeItem(id: string): Promise<boolean> {
  try {
    await db.prepare('DELETE FROM marquee_items WHERE id = ?').bind(id).run();
    return true;
  } catch (err) {
    console.error('[D1 Delete Marquee Item Error]:', err);
    return false;
  }
}

// ==============================================================================
// 4. TRUST PILLARS (4-PILLAR ICON BOX)
// ==============================================================================

export async function getActiveTrustPillars(): Promise<TrustPillar[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM trust_pillars WHERE is_active = 1 ORDER BY display_order ASC')
      .all<TrustPillar>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get Trust Pillars Warning]:', err);
    return [];
  }
}

export async function getAllTrustPillarsAdmin(): Promise<TrustPillar[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM trust_pillars ORDER BY display_order ASC')
      .all<TrustPillar>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get All Trust Pillars Warning]:', err);
    return [];
  }
}

export async function saveTrustPillar(pillar: Partial<TrustPillar>): Promise<boolean> {
  try {
    const id = pillar.id || `tp_${Date.now()}`;
    await db
      .prepare(
        `INSERT INTO trust_pillars (id, title, description, icon_name, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           description = excluded.description,
           icon_name = excluded.icon_name,
           display_order = excluded.display_order,
           is_active = excluded.is_active;`
      )
      .bind(
        id,
        pillar.title || '',
        pillar.description || '',
        pillar.icon_name || 'Truck',
        pillar.display_order ?? 0,
        pillar.is_active ? 1 : 0
      )
      .run();
    return true;
  } catch (err) {
    console.error('[D1 Save Trust Pillar Error]:', err);
    return false;
  }
}

// ==============================================================================
// 5. SOCIAL PROOF LIVE ORDER NOTIFICATIONS
// ==============================================================================

export async function getActiveSocialProofNotifications(): Promise<SocialProofNotification[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM social_proof_notifications WHERE is_active = 1')
      .all<SocialProofNotification>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get Social Proof Warning]:', err);
    return [];
  }
}

export async function getAllSocialProofAdmin(): Promise<SocialProofNotification[]> {
  try {
    const rows = await db
      .prepare('SELECT * FROM social_proof_notifications')
      .all<SocialProofNotification>();
    return rows.results || [];
  } catch (err) {
    console.warn('[D1 Get All Social Proof Warning]:', err);
    return [];
  }
}

export async function saveSocialProofNotification(sp: Partial<SocialProofNotification>): Promise<boolean> {
  try {
    const id = sp.id || `sp_${Date.now()}`;
    await db
      .prepare(
        `INSERT INTO social_proof_notifications (id, product_title, product_image, product_url, city, time_ago, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           product_title = excluded.product_title,
           product_image = excluded.product_image,
           product_url = excluded.product_url,
           city = excluded.city,
           time_ago = excluded.time_ago,
           is_active = excluded.is_active;`
      )
      .bind(
        id,
        sp.product_title || '',
        sp.product_image || '',
        sp.product_url || '/shop',
        sp.city || 'Mumbai, Maharashtra',
        sp.time_ago || 'a few minutes ago',
        sp.is_active ? 1 : 0
      )
      .run();
    return true;
  } catch (err) {
    console.error('[D1 Save Social Proof Error]:', err);
    return false;
  }
}

export async function deleteSocialProofNotification(id: string): Promise<boolean> {
  try {
    await db.prepare('DELETE FROM social_proof_notifications WHERE id = ?').bind(id).run();
    return true;
  } catch (err) {
    console.error('[D1 Delete Social Proof Error]:', err);
    return false;
  }
}

// ==============================================================================
// 6. SITE SETTINGS
// ==============================================================================

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  store_name: 'Stitchclothes',
  store_tagline: 'Premium Streetwear & Anime Clothiers',
  support_phone: '+918310274918',
  support_email: 'snfabricsenquiry@gmail.com',
  whatsapp_number: '8310274918',
  instagram_url: 'https://instagram.com/stitchclothes',
  facebook_url: 'https://facebook.com/stitchclothes',
  pinterest_url: 'https://pinterest.com/stitchclothes',
  free_shipping_threshold: 499,
  standard_shipping_fee: 49,
  cod_enabled: false,
  exit_intent_enabled: true,
  exit_intent_coupon: 'STITCH10',
  social_proof_enabled: true,
  social_proof_interval_sec: 12
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.prepare('SELECT key, value FROM site_settings').all<{ key: string; value: string }>();
    const map: Record<string, string> = {};
    (rows.results || []).forEach(r => {
      map[r.key] = r.value;
    });

    return {
      store_name: map['store_name'] || DEFAULT_SITE_SETTINGS.store_name,
      store_tagline: map['store_tagline'] || DEFAULT_SITE_SETTINGS.store_tagline,
      support_phone: map['support_phone'] || DEFAULT_SITE_SETTINGS.support_phone,
      support_email: map['support_email'] || DEFAULT_SITE_SETTINGS.support_email,
      whatsapp_number: map['whatsapp_number'] || DEFAULT_SITE_SETTINGS.whatsapp_number,
      instagram_url: map['instagram_url'] || DEFAULT_SITE_SETTINGS.instagram_url,
      facebook_url: map['facebook_url'] || DEFAULT_SITE_SETTINGS.facebook_url,
      pinterest_url: map['pinterest_url'] || DEFAULT_SITE_SETTINGS.pinterest_url,
      free_shipping_threshold: Number(map['free_shipping_threshold'] || DEFAULT_SITE_SETTINGS.free_shipping_threshold),
      standard_shipping_fee: Number(map['standard_shipping_fee'] || DEFAULT_SITE_SETTINGS.standard_shipping_fee),
      cod_enabled: false,
      exit_intent_enabled: map['exit_intent_enabled'] !== 'false',
      exit_intent_coupon: map['exit_intent_coupon'] || DEFAULT_SITE_SETTINGS.exit_intent_coupon,
      social_proof_enabled: map['social_proof_enabled'] !== 'false',
      social_proof_interval_sec: Number(map['social_proof_interval_sec'] || DEFAULT_SITE_SETTINGS.social_proof_interval_sec)
    };
  } catch (err) {
    console.warn('[D1 Get Site Settings Warning]:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSetting(key: string, value: string): Promise<boolean> {
  try {
    await db
      .prepare(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;`
      )
      .bind(key, value)
      .run();
    return true;
  } catch (err) {
    console.error('[D1 Update Site Setting Error]:', err);
    return false;
  }
}
