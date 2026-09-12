'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Placement } from '@/lib/types';

interface AdBannerSectionProps {
  campaignAd?: Placement;
  promoStrip?: Placement;
}

export function AdBannerSection({ campaignAd, promoStrip }: AdBannerSectionProps) {
  return (
    <div className="w-full space-y-12 my-12 sm:my-20">
      {/* 1. Main Editorial Campaign Ad (if active) */}
      {campaignAd && campaignAd.is_active && (
        <section className="relative w-full overflow-hidden bg-[#0C1427] text-white">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[550px] sm:min-h-[620px]">
            {/* Image Col (7 cols) */}
            <div className="lg:col-span-7 relative min-h-[350px] lg:min-h-full overflow-hidden group">
              <Image
                src={campaignAd.image_url}
                alt={campaignAd.title || 'Shipfold Campaign Ad'}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content Col (5 cols) */}
            <div className="lg:col-span-5 p-8 sm:p-14 lg:p-16 flex flex-col justify-center bg-[#0C1427] relative z-10">
              {campaignAd.badge_text && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
                    {campaignAd.badge_text}
                  </span>
                </div>
              )}

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.2] mb-4 sm:mb-6 tracking-tight">
                {campaignAd.title || 'The Autumn / Winter Atelier'}
              </h2>

              {campaignAd.subtitle && (
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6 sm:mb-8 max-w-md tracking-wide">
                  {campaignAd.subtitle}
                </p>
              )}

              <div>
                <Link
                  href={campaignAd.link_url || '/shop'}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-3 px-8 py-3.5 bg-white text-[#0C1427] hover:bg-[#C5A880] hover:text-white text-[11px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-xl"
                >
                  <span>{campaignAd.cta_text || 'Explore Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                <span>Hand-Finished in Italy &amp; Peru</span>
                <span>Numbered Editions</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Privilege Ad Strip (if active) */}
      {promoStrip && promoStrip.is_active && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#111A33] via-[#0C1427] to-[#1E293B] border border-[#C5A880]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            {/* Background image watermark */}
            {promoStrip.image_url && (
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 overflow-hidden pointer-events-none hidden sm:block">
                <img
                  src={promoStrip.image_url}
                  alt="Pattern background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="relative z-10 text-center sm:text-left space-y-1 max-w-2xl">
              {promoStrip.badge_text && (
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold block">
                  {promoStrip.badge_text}
                </span>
              )}
              <h3 className="font-serif text-xl sm:text-2xl text-white font-normal tracking-wide">
                {promoStrip.title || 'Exclusive Private Client Privilege'}
              </h3>
              {promoStrip.subtitle && (
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {promoStrip.subtitle}
                </p>
              )}
            </div>

            <div className="relative z-10 shrink-0">
              <Link
                href={promoStrip.link_url || '/shop'}
                className="px-6 py-3 bg-[#C5A880] text-[#0C1427] hover:bg-white text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center gap-2 shadow-lg"
              >
                <span>{promoStrip.cta_text || 'Claim Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
