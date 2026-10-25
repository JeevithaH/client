import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { HeroSlider } from '@/components/home/hero-slider';
import { InteractiveClothingRackHero } from '@/components/home/interactive-clothing-rack-hero';
import { MovingHoodieCampaignBanner } from '@/components/home/moving-hoodie-campaign-banner';
import { CollectionCards } from '@/components/home/collection-cards';
import { MarqueeTicker } from '@/components/home/marquee-ticker';
import { TrustPillars } from '@/components/home/trust-pillars';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { ProductCard } from '@/components/shop/product-card';
import {
  getAllProducts,
  getCategories,
  getActiveHeroSlides,
  getActiveMarqueeItems,
  getActiveTrustPillars,
  getActivePlacements
} from '@/lib/db';

export const revalidate = 60; // Ultra-fast edge ISR cache (instant <50ms loads, revalidates in background)

export default async function HomePage() {
  const [
    products,
    categories,
    heroSlides,
    marqueeItems,
    trustPillars,
    placements
  ] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getActiveHeroSlides(),
    getActiveMarqueeItems(),
    getActiveTrustPillars(),
    getActivePlacements(),
  ]);

  const trendingProducts = products.slice(0, 8);
  const bestSellers = products.filter((p) => p.is_bestseller).length > 0
    ? products.filter((p) => p.is_bestseller).slice(0, 8)
    : products.slice(4, 12);

  const campaignAd = placements.find((p) => p.slot_key === 'home_ad_campaign');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Viral Interactive Clothing Rack Hero (Instagram Concept) */}
      <InteractiveClothingRackHero />

      {/* 2. Popular Collections Circular Cards Grid */}
      <CollectionCards categories={categories} />

      {/* 3. Trending Drops Section */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#DC2626]">
                <Flame className="w-3.5 h-3.5 fill-[#DC2626]" />
                <span>HOT &amp; FRESH DROPS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0E0E0E] mt-1 font-sans">
                Trending Streetwear
              </h2>
            </div>

            <Link
              href="/collections/all"
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1.5 group"
            >
              <span>Explore All Drops</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Marquee Slogan Ticker Ribbon */}
      <MarqueeTicker items={marqueeItems} />

      {/* 5. Moving Anime & Heavyweight Hoodies Campaign Section */}
      <MovingHoodieCampaignBanner />

      {/* 6. Best Sellers Section */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#0E0E0E]">
                <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>CUSTOMER FAVORITES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0E0E0E] mt-1 font-sans">
                Best Selling Pieces
              </h2>
            </div>

            <Link
              href="/collections/best-selling"
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1.5 group"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. 4 Trust Pillars & Guarantees */}
      <TrustPillars pillars={trustPillars} />

      {/* 8. Newsletter VIP Signup */}
      <NewsletterSection />
    </div>
  );
}
