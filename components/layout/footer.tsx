'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { CONCIERGE_PHONE_DISPLAY } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="bg-[#0E0E0E] text-zinc-400 border-t border-zinc-800 text-xs font-light">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16 space-y-10">
        {/* Brand & Mission */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800 text-center md:text-left">
          <div>
            <span className="font-sans text-2xl font-bold tracking-[0.3em] text-white uppercase block">
              SHIPFOLD
            </span>
            <p className="text-zinc-400 text-xs mt-1 max-w-md font-light">
              Specialists in luxury cotton T-shirts. Crafted from 100% American Supima® and Egyptian long-staple cotton with custom embroidery and bulk bespoke orders.
            </p>
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+918310246790"
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-[#C5A880] hover:text-white text-xs uppercase tracking-wider transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{CONCIERGE_PHONE_DISPLAY}</span>
            </a>
            <a
              href="https://wa.me/918310246790?text=Hello%20Shipfold%2C%20I%20would%20like%20to%20inquire%20about%20T-shirt%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60 text-xs uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Clean Essential Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-y-4 gap-x-8 text-xs uppercase tracking-widest text-zinc-300 font-medium">
          <Link href="/shop" className="hover:text-white transition-colors luxury-link">
            All T-Shirts
          </Link>
          <Link href="/custom" className="text-[#C5A880] hover:text-white transition-colors font-semibold luxury-link">
            Custom &amp; Bulk Orders
          </Link>
          <Link href="/custom?tab=request" className="hover:text-white transition-colors luxury-link">
            Request a Design
          </Link>
          <Link href="/account" className="hover:text-white transition-colors luxury-link">
            Track Order
          </Link>
        </div>

        {/* Bottom Copyright & Security */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 text-center">
          <div className="flex items-center gap-2">
            <span>Razorpay Secure (UPI, Cards, Netbanking)</span>
            <span>•</span>
            <span>All India Express Delivery</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} SHIPFOLD. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
