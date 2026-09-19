import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { HeroSlider } from '@/components/home/hero-slider';
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
      {/* 1. Glozin Full-Bleed Hero Carousel Slider */}
      <HeroSlider slides={heroSlides} />

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

      {/* 5. Editorial Mid-Page Campaign Feature Banner */}
      {campaignAd ? (
        <section className="py-12 bg-[#0E0E0E] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[21/9] min-h-[300px] w-full overflow-hidden border border-zinc-800 flex items-center justify-center text-center p-6">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: `url(${campaignAd.image_url})` }}
              />
              <div className="relative z-10 max-w-xl space-y-3">
                {campaignAd.badge_text && (
                  <span className="px-2.5 py-1 bg-[#EAB308] text-black text-[9px] uppercase font-bold tracking-widest inline-block">
                    {campaignAd.badge_text}
                  </span>
                )}
                <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight">
                  {campaignAd.title}
                </h3>
                {campaignAd.subtitle && (
                  <p className="text-xs sm:text-sm text-zinc-300 font-light">
                    {campaignAd.subtitle}
                  </p>
                )}
                <div className="pt-2">
                  <Link
                    href={campaignAd.link_url || '/collections/all'}
                    className="inline-block px-6 py-3 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-bold transition-colors"
                  >
                    {campaignAd.cta_text || 'Shop Now'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-14 sm:py-16 bg-[#0E0E0E] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#EAB308]">
              Artisanal Oversized Fits
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight">
              Exclusive Anime &amp; Heavyweight Hoodies
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
              Engineered with 380 GSM fleece and 240 GSM combed cotton. Built for all-day comfort and street presence.
            </p>
            <div className="pt-2">
              <Link
                href="/collections/hoodies"
                className="inline-block px-7 py-3.5 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-bold transition-all shadow-md"
              >
                Explore Hoodies Collection
              </Link>
            </div>
          </div>
        </section>
      )}

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
