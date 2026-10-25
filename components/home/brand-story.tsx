'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BrandStory() {
  return (
    <section className="py-24 bg-white border-t border-zinc-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual Showcase - Atelier Craftsmanship */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto lg:max-w-none bg-[#F6F5F3] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1400&auto=format&fit=crop"
                alt="Shipfold Savoir-Faire & Tailoring"
                fill
                className="object-cover transition-transform duration-700 hover:scale-103"
              />
            </div>

            {/* Subtle Atelier Note */}
            <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400">
              <span>Savoir-Faire</span>
              <span>Double-Combed 60s Count Pima</span>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-medium">
                The House of AVIVEKY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0E0E0E] font-normal leading-tight">
                The Art of Exceptional Tailoring
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
              At AVIVEKY, every silhouette is born from an uncompromising pursuit of perfection. Each fiber is selected from the top fraction of global extra-long staple harvests, spun at high twists to resist pilling, and finished with double-bath mercerization for a subtle, enduring luster.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-2 border-t border-zinc-200">
              <div>
                <span className="block font-serif text-2xl text-[#0E0E0E]">0.05%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mt-1 block">
                  Rare Staple Harvest
                </span>
                <p className="text-xs text-zinc-500 font-light mt-1">
                  Only the top 0.05% of global cotton fibers satisfy our staple requirements.
                </p>
              </div>

              <div>
                <span className="block font-serif text-2xl text-[#0E0E0E]">2-Ply</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mt-1 block">
                  Mercerized Luster
                </span>
                <p className="text-xs text-zinc-500 font-light mt-1">
                  Awakens depth of color and silk-like drape without synthetic additives.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-medium text-[#0E0E0E] hover:opacity-70 transition-opacity border-b border-[#0E0E0E] pb-1"
              >
                <span>Discover the Savoir-Faire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
