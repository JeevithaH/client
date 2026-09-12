'use client';

import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#0E0E0E] text-zinc-300 text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-light border-b border-white/10 py-1.5 sm:py-2 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile View: Clean single centered row with zero horizontal overflow */}
        <div className="flex sm:hidden items-center justify-between gap-1 text-[10px] w-full">
          <span className="truncate max-w-[140px]">Free Delivery &gt; ₹1,499</span>
          <span className="text-zinc-700">•</span>
          <Link
            href="/custom"
            className="text-[#C5A880] hover:text-white shrink-0 font-medium"
          >
            Custom
          </Link>
          <span className="text-zinc-700">•</span>
          <a
            href="tel:+918310246790"
            className="text-zinc-300 hover:text-white shrink-0 flex items-center gap-1 font-medium"
            title="Call Atelier"
          >
            <Phone className="w-2.5 h-2.5 text-[#C5A880]" />
            <span>8310246790</span>
          </a>
        </div>

        {/* Desktop View: Full luxury two-sided bar */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-400">
            <span>100% Premium Cotton T-Shirts</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-300">Free Express Delivery Above ₹1,499</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/custom"
              className="text-[#C5A880] hover:text-white transition-colors font-medium"
            >
              Bulk &amp; Custom Orders
            </Link>
            <span className="text-zinc-700">•</span>
            <a
              href="tel:+918310246790"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1 font-medium"
              title="Call Atelier"
            >
              <Phone className="w-3 h-3 text-[#C5A880]" />
              <span>+91 8310246790</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
