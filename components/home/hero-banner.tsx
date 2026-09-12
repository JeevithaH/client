'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Placement } from '@/lib/types';

interface HeroBannerProps {
  placement?: Placement;
}

export function HeroBanner({ placement }: HeroBannerProps) {
  const bgImage =
    placement?.image_url ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2200&auto=format&fit=crop';
  const badge = placement?.badge_text || 'Spring - Summer 2026 Collection';
  const title = placement?.title || 'The Art of the Luxury T-Shirt';
  const subtitle =
    placement?.subtitle ||
    'Engineered from American Supima® and double-mercerized Egyptian cotton. Pure lines, sculptural drape, and enduring softness.';
  const linkUrl = placement?.link_url || '/shop';
  const ctaText = placement?.cta_text || 'Explore Collection';

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] flex items-end justify-center overflow-hidden bg-[#0E0E0E]">
      {/* Background cinematic imagery with subtle zoom effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={title}
          fill
          priority
          className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.82]"
        />
        {/* Soft high-fashion gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
      </div>

      {/* Center / Bottom Campaign Dossier */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16 sm:pb-24 pt-32 text-center text-white flex flex-col items-center">
        {/* Collection Subtitle / Badge */}
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/80 font-medium mb-3">
          {badge}
        </span>

        {/* Campaign Title */}
        <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white max-w-3xl leading-[1.2] mb-3 sm:mb-4 px-2">
          {title}
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8 tracking-wide px-2">
          {subtitle}
        </p>

        {/* Louis Vuitton Pill CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href={linkUrl}
            className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-full bg-white text-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border border-white shadow-xl flex items-center gap-2"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/shop?category=polos"
            className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-[#0E0E0E] text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border border-white/40"
          >
            Luxury Polos
          </Link>
        </div>

        {/* Minimalist 3-Pillar Brand Bar */}
        <div className="w-full max-w-3xl mt-10 sm:mt-14 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center text-white/70 text-[10px] sm:text-[11px] uppercase tracking-[0.25em]">
          <div>100% Rare Staple Cotton</div>
          <div>Double Mercerized</div>
          <div>Complimentary White-Glove Shipping</div>
        </div>
      </div>
    </section>
  );
}
