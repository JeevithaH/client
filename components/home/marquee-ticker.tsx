'use client';

import React from 'react';
import { Sparkles, Zap, Flame } from 'lucide-react';
import { MarqueeItem } from '@/lib/types';

interface MarqueeTickerProps {
  items?: MarqueeItem[];
}

export function MarqueeTicker({ items = [] }: MarqueeTickerProps) {
  const defaultItems: MarqueeItem[] = [
    { id: '1', text: 'Diwali sale discount off 50%', is_active: true, display_order: 1 },
    { id: '2', text: 'Free shipping on all India orders above ₹499', is_active: true, display_order: 2 },
    { id: '3', text: 'Limited Edition Balaclava Drops', is_active: true, display_order: 3 },
    { id: '4', text: '100% Secure Payment via UPI & COD', is_active: true, display_order: 4 },
  ];

  const activeItems = items.length > 0 ? items.filter(i => i.is_active) : defaultItems;

  return (
    <div className="w-full bg-[#0E0E0E] text-white py-3.5 overflow-hidden border-y border-zinc-800 select-none">
      <div className="flex w-max animate-marquee">
        {[...Array(4)].map((_, repeatIdx) => (
          <div key={repeatIdx} className="flex items-center space-x-8 shrink-0 px-4">
            {activeItems.map((item) => (
              <div key={`${repeatIdx}-${item.id}`} className="flex items-center space-x-4">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] font-sans">
                  {item.text}
                </span>
                <span className="text-[#EAB308]">★</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
