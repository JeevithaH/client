'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/shop/product-card';

interface CuratedTabsProps {
  products: Product[];
}

type TabType = 'featured' | 'new' | 'bestsellers';

export function CuratedTabs({ products }: CuratedTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('featured');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'featured') return p.is_featured;
    if (activeTab === 'new') return p.is_new;
    if (activeTab === 'bestsellers') return p.is_bestseller;
    return true;
  });

  return (
    <section className="py-24 bg-[#F6F5F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-medium">
            The Seasonal Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0E0E0E] font-normal tracking-tight">
            Curated Wardrobe
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 sm:mb-14 overflow-x-auto px-4">
          <div className="inline-flex border-b border-zinc-300 gap-4 sm:gap-12 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-medium whitespace-nowrap min-w-max">
            <button
              onClick={() => setActiveTab('featured')}
              className={`pb-3.5 transition-colors relative ${
                activeTab === 'featured'
                  ? 'text-[#0E0E0E] font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#0E0E0E]'
                  : 'text-zinc-400 hover:text-[#0E0E0E]'
              }`}
            >
              Featured Highlights
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3.5 transition-colors relative ${
                activeTab === 'new'
                  ? 'text-[#0E0E0E] font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#0E0E0E]'
                  : 'text-zinc-400 hover:text-[#0E0E0E]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`pb-3.5 transition-colors relative ${
                activeTab === 'bestsellers'
                  ? 'text-[#0E0E0E] font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#0E0E0E]'
                  : 'text-zinc-400 hover:text-[#0E0E0E]'
              }`}
            >
              Iconic Bestsellers
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-9 py-3.5 rounded-full bg-[#0E0E0E] text-white hover:bg-zinc-800 text-[11px] uppercase tracking-[0.25em] font-medium transition-all shadow-md"
          >
            <span>Discover All T-Shirts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
