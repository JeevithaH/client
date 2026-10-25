'use client';

import React from 'react';
import { MarqueeItem } from '@/lib/types';

interface MarqueeTickerProps {
  items?: MarqueeItem[];
}

export function MarqueeTicker({ items = [] }: MarqueeTickerProps) {
  const defaultItems: MarqueeItem[] = [
    { id: '1', text: 'Diwali sale discount off 50%', is_active: true, display_order: 1 },
    { id: '2', text: 'Free shipping on all India orders above ₹499', is_active: true, display_order: 2 },
    { id: '3', text: 'Limited Edition Balaclava Drops', is_active: true, display_order: 3 },
    { id: '4', text: '100% Secure Payment via UPI, Cards & Netbanking', is_active: true, display_order: 4 },
  ];

  // Filter active and sanitize any legacy COD mention
  const sourceItems = items.length > 0 ? items.filter((i) => i.is_active) : defaultItems;
  const activeItems = sourceItems.map((item) => ({
    ...item,
    text: item.text
      .replace(/& COD/gi, '& Cards')
      .replace(/and COD/gi, 'and Cards')
      .replace(/\bCOD\b/gi, 'Cards & Netbanking')
      .trim(),
  }));

  // Build a single robust sequence
  const sequence = [...activeItems, ...activeItems];

  return (
    <div
      className="w-full bg-[#0E0E0E] text-white py-3.5 overflow-hidden border-y border-zinc-800 select-none relative"
      aria-label="Promotional marquee ribbon"
    >
      <div className="flex w-max animate-marquee-smooth hover:[animation-play-state:paused]">
        {/* Track A */}
        <div className="flex items-center space-x-8 shrink-0 px-4">
          {sequence.map((item, idx) => (
            <div key={`trackA-${item.id}-${idx}`} className="flex items-center space-x-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] font-sans text-zinc-100 whitespace-nowrap">
                {item.text}
              </span>
              <span className="text-[#EAB308] text-sm select-none">★</span>
            </div>
          ))}
        </div>

        {/* Track B (Exact duplicate for 100% seamless infinite looping) */}
        <div className="flex items-center space-x-8 shrink-0 px-4" aria-hidden="true">
          {sequence.map((item, idx) => (
            <div key={`trackB-${item.id}-${idx}`} className="flex items-center space-x-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] font-sans text-zinc-100 whitespace-nowrap">
                {item.text}
              </span>
              <span className="text-[#EAB308] text-sm select-none">★</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
