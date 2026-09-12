import React from 'react';
import { HeroBanner } from '@/components/home/hero-banner';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { CuratedTabs } from '@/components/home/curated-tabs';
import { BrandStory } from '@/components/home/brand-story';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { AdBannerSection } from '@/components/home/ad-banner-section';
import { getAllProducts, getActivePlacements } from '@/lib/db';

export const revalidate = 0; // Fresh catalogue data

export default async function HomePage() {
  const products = await getAllProducts();
  const placements = await getActivePlacements();

  const heroPlacement = placements.find((p) => p.slot_key === 'hero_banner');
  const campaignAd = placements.find((p) => p.slot_key === 'home_ad_campaign');
  const promoStrip = placements.find((p) => p.slot_key === 'home_ad_strip');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Editorial Luxury Hero Banner */}
      <HeroBanner placement={heroPlacement} />

      {/* Signature Categories Grid */}
      <CategoriesGrid />

      {/* Curated Product Tabs: Featured, New Arrivals, Bestsellers */}
      <CuratedTabs products={products} />

      {/* Curated Campaign Ad Banner & Privilege Strip Placements */}
      <AdBannerSection campaignAd={campaignAd} promoStrip={promoStrip} />

      {/* Brand Craftsmanship & Cotton Story */}
      <BrandStory />

      {/* Privilege Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}
