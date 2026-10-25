'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface CampaignSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  bgImage: string;
}

const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: 'hoodie-slide-1',
    eyebrow: 'ARTISANAL OVERSIZED FITS',
    title: 'EXCLUSIVE ANIME & HEAVYWEIGHT HOODIES',
    subtitle: 'Engineered with 380 GSM fleece and 240 GSM combed cotton. Built for all-day comfort and street presence.',
    ctaText: 'Explore Hoodies Collection',
    ctaLink: '/collections/hoodies',
    badge: 'LIMITED EDITION',
    bgImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'hoodie-slide-2',
    eyebrow: 'HEAVYWEIGHT ARCHITECTURAL STREETWEAR',
    title: 'CYBERPUNK & MANGA GRAPHIC DROPS',
    subtitle: 'High-density 3D puff embroidery, metallic needlework, and acid-washed Japanese cotton cuts.',
    ctaText: 'Shop Graphic Editions',
    ctaLink: '/collections/unique-design-clothes',
    badge: 'NEW ATELIER DROP',
    bgImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'hoodie-slide-3',
    eyebrow: 'WINTER LUXURY FLEECE',
    title: 'SOVEREIGN 400 GSM BOX CUTS',
    subtitle: 'Double-layered hoods with anti-sag structure and brushed interior warmth for all-day comfort.',
    ctaText: 'Discover Boxy Fits',
    ctaLink: '/collections/all',
    badge: 'CORE ESSENTIAL',
    bgImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1920&auto=format&fit=crop',
  },
];

const MOVING_HOODIE_PRODUCTS = [
  {
    id: 'prod-h1',
    title: 'Biella Heavyweight Boxy Hoodie',
    tag: '400 GSM French Terry',
    price: 3499,
    compareAtPrice: 4999,
    image: '/fixtures/rack/hoodie/front.webp',
    slug: 'heavyweight-boxy-hoodie',
  },
  {
    id: 'prod-h2',
    title: 'Manga Graphic Insignia Hoodie',
    tag: '380 GSM Brushed Loopback',
    price: 3299,
    compareAtPrice: 4499,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    slug: 'manga-graphic-hoodie',
  },
  {
    id: 'prod-h3',
    title: 'Architectural Compact Crewneck',
    tag: '340 GSM Compact Fleece',
    price: 2899,
    compareAtPrice: 3999,
    image: '/fixtures/rack/crew/front.webp',
    slug: 'biella-heavyweight-boxy-tee',
  },
  {
    id: 'prod-h4',
    title: 'Verona Mineral Washed Boxy',
    tag: '280 GSM Pumice Wash',
    price: 2299,
    compareAtPrice: 3199,
    image: '/fixtures/rack/cards-pink-v3/front.webp',
    slug: 'verona-mineral-washed-boxy-tee',
  },
  {
    id: 'prod-h5',
    title: 'Sovereign Supima® Alpine Tee',
    tag: '190 GSM 100% Supima®',
    price: 2199,
    compareAtPrice: 2999,
    image: '/fixtures/rack/lake-white-v3/front.webp',
    slug: 'sovereign-supima-crew-t-shirt',
  },
  {
    id: 'prod-h6',
    title: 'Signature Atelier Graphic Tee',
    tag: '240 GSM Combed Streetwear',
    price: 1999,
    compareAtPrice: 2699,
    image: '/fixtures/rack/tee/front.webp',
    slug: 'custom-bespoke-atelier-embroidered-tee',
  },
];

export function MovingHoodieCampaignBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slideshow with smooth motion
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const active = CAMPAIGN_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full bg-[#0A0A0C] text-white overflow-hidden py-14 sm:py-20 border-y border-zinc-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Exclusive Anime and Heavyweight Hoodies Moving Campaign"
    >
      {/* 1. Cinematic Background with Smooth Moving Pan & Zoom */}
      {CAMPAIGN_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
            idx === currentSlide ? 'opacity-35 z-0' : 'opacity-0'
          }`}
        >
          <div
            className={`relative w-full h-full transition-transform duration-[7000ms] ease-out ${
              idx === currentSlide ? 'scale-105 translate-x-1' : 'scale-100'
            }`}
          >
            <Image
              src={slide.bgImage}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={idx === 0}
              className="object-cover object-center brightness-[0.6] filter"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/70 to-[#0A0A0C]" />
        </div>
      ))}

      {/* Ambient Moving Gold Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#EAB308]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Central Moving Feature Content */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Badge & Eyebrow */}
          <div className="flex items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAB308] text-black text-[9px] uppercase font-bold tracking-[0.25em] shadow-md animate-pulse">
              <Flame className="w-3 h-3 fill-black" />
              <span>{active.badge}</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.35em] text-[#EAB308]">
              {active.eyebrow}
            </span>
          </div>

          {/* Headline with Smooth Fade & Motion */}
          <h2
            key={`title-${currentSlide}`}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight font-serif text-white leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500 drop-shadow-lg"
          >
            {active.title}
          </h2>

          {/* Subtitle */}
          <p
            key={`subtitle-${currentSlide}`}
            className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-500"
          >
            {active.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={active.ctaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black hover:bg-[#EAB308] hover:text-black text-xs uppercase tracking-widest font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-200"
            >
              <span>{active.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/custom"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/30 text-white hover:border-[#EAB308] hover:text-[#EAB308] text-xs uppercase tracking-widest font-semibold transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>Custom Monogram Orders</span>
            </Link>
          </div>

          {/* Interactive Slide Indicators & Controls */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + CAMPAIGN_SLIDES.length) % CAMPAIGN_SLIDES.length)}
              className="p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {CAMPAIGN_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === currentSlide ? 'w-8 bg-[#EAB308]' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % CAMPAIGN_SLIDES.length)}
              className="p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. INFINITE MOVING PRODUCTS RUNWAY TRACK */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#EAB308]" />
              <span>LIVE ATELIER RUNWAY &bull; SLIDING HOODIES &amp; FLEECES</span>
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline-block">
              Hover over piece to hold
            </span>
          </div>

          {/* Seamless Infinite Moving Track */}
          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-2">
              {[...MOVING_HOODIE_PRODUCTS, ...MOVING_HOODIE_PRODUCTS].map((product, index) => (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/product/${product.slug}`}
                  className="group relative w-[220px] sm:w-[260px] mx-3 p-3 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-[#EAB308]/60 transition-all duration-300 flex flex-col justify-between shrink-0 shadow-lg hover:-translate-y-1.5"
                >
                  {/* Product Image Stage */}
                  <div className="relative w-full aspect-[4/5] bg-zinc-950 overflow-hidden mb-3 border border-zinc-800/80">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="260px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-[#EAB308] border border-white/10">
                      {product.tag}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-white group-hover:text-[#EAB308] transition-colors truncate">
                      {product.title}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-xs font-bold text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-zinc-500 line-through">
                        ₹{product.compareAtPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quick Shop Overlay Indicator */}
                  <div className="mt-2.5 pt-2 border-t border-zinc-800/70 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                    <span>Inspect Garment</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
