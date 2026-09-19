'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '@/lib/types';

interface CollectionCardsProps {
  categories?: Category[];
}

export function CollectionCards({ categories = [] }: CollectionCardsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0E0E0E]">
              Streetwear Curations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0E0E0E] mt-1 font-sans">
              Popular Collections
            </h2>
          </div>
          <Link
            href="/collections/all"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black mt-2 sm:mt-0 flex items-center gap-1 group"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group relative flex flex-col items-center bg-white border border-zinc-200 hover:border-black transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg p-3 text-center"
            >
              {/* Image Circle Container */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-100 mb-3 border border-zinc-100 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={cat.image_url || 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_11.png'}
                  alt={cat.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100px, 120px"
                />
              </div>

              {/* Title & Arrow */}
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0E0E0E] group-hover:text-zinc-600 transition-colors truncate w-full">
                {cat.name}
              </h3>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">
                Explore
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
