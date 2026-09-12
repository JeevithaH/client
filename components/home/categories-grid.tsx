'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SEED_CATEGORIES } from '@/lib/seed-data';

export function CategoriesGrid() {
  return (
    <section className="py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-medium">
            Permanent & Seasonal Silhouettes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0E0E0E] font-normal tracking-tight">
            The Signatures of the House
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed">
            From double-mercerized piqué collars to the drape of 280 GSM heavyweight jerseys.
          </p>
        </div>

        {/* 6 Clean Editorial Banners in 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SEED_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug === 'custom-bespoke' ? '/custom' : `/shop?category=${cat.slug}`}
              className="group flex flex-col bg-[#F6F5F3] overflow-hidden transition-all duration-500 border border-zinc-100 hover:border-zinc-300"
            >
              {/* Image Container with Smooth Zoom */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-200">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* Minimal Caption Area Below Image */}
              <div className="p-5 flex flex-col justify-between flex-1 bg-white space-y-2">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-medium block">
                    Collection Curation
                  </span>
                  <h3 className="font-sans text-sm uppercase tracking-[0.15em] font-medium text-[#0E0E0E] group-hover:text-zinc-600 transition-colors mt-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-light line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-[#0E0E0E] group-hover:translate-x-1 transition-transform">
                  <span>Discover</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
