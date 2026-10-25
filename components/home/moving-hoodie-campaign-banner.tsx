'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, ShieldCheck, Zap } from 'lucide-react';

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
      className="relative w-full bg-[#0A0A0C] text-white overflow-hidden py-16 sm:py-24 border-y border-zinc-800"
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
              <Flame className="w-3 h-3 fill-black text-black" />
              <span>{active.badge}</span>
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#EAB308] font-bold">
              {active.eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-sans drop-shadow-md">
            {active.title}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            {active.subtitle}
          </p>

          {/* Quality Spec Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-3 text-[10px] uppercase font-semibold tracking-widest text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>380–400 GSM Heavy Fleece</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
              <span>Pre-Shrunk 100% Cotton</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
              <span>Zero Color Bleed Direct Weave</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={active.ctaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#EAB308] text-black hover:bg-yellow-400 text-xs uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-yellow-500/20 hover:scale-102"
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
          <div className="pt-6 flex items-center justify-center gap-3">
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
      </div>
    </section>
  );
}
