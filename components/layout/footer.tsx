'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0E0E0E] text-zinc-400 border-t border-zinc-800 text-xs font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Top Grid: Brand, Collections, Customer Care, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-zinc-800">
          {/* Col 1 & 2: Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-sans text-2xl font-black tracking-[0.2em] text-white uppercase block">
              STiTCH
            </span>
            <p className="text-zinc-400 text-xs max-w-sm font-light leading-relaxed">
              Streetwear drops, anime apparel, heavyweight hoodies &amp; oversized tees. Engineered with 380 GSM fleece and 240 GSM combed cotton. Built for all-day comfort and street presence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/918310274918?text=Hello%20STiTCH%2C%20I%20would%20like%20to%20inquire%20about%20orders."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/70 text-[11px] uppercase tracking-wider font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge</span>
              </a>
              <a
                href="tel:+918310274918"
                className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-white hover:text-white text-[11px] uppercase tracking-wider font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91 8310274918</span>
              </a>
            </div>
          </div>

          {/* Col 3: Popular Collections */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <Link href="/collections/hoodies" className="hover:text-white transition-colors">
                  Hoodies &amp; Sweatshirts
                </Link>
              </li>
              <li>
                <Link href="/collections/oversized-t-shirt" className="hover:text-white transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/polo-t-shirts" className="hover:text-white transition-colors">
                  Polo T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/jeans-shirt" className="hover:text-white transition-colors">
                  Jeans Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/best-selling" className="hover:text-white transition-colors">
                  Best Selling
                </Link>
              </li>
              <li>
                <Link href="/collections/hot-sale" className="hover:text-white transition-colors">
                  Hot Sale Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care & Services */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Delivery &amp; Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  7-Day Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link href="/custom" className="hover:text-white transition-colors">
                  Custom &amp; Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Concierge Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Store Direct Concierge */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white">
              Contact Atelier
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <a href="mailto:snfabricsenquiry@gmail.com" className="hover:text-white truncate">
                  snfabricsenquiry@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <a href="tel:+918310274918" className="hover:text-white">
                  +91 8310274918
                </a>
              </p>
              <p className="flex items-center gap-2 text-zinc-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Pan India Express Shipping</span>
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Policy Quick Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2.5 pt-4 text-[11px] text-zinc-400">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Link href="/shipping-policy" className="hover:text-white transition-colors">
            Delivery &amp; Shipping Policy
          </Link>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Link href="/refund-policy" className="hover:text-white transition-colors">
            Returns &amp; Refunds
          </Link>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Link href="/copyright" className="hover:text-white transition-colors">
            Copyright
          </Link>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 text-center sm:text-left pt-2 border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} STiTCH (Stitchclothes). All rights reserved.</span>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <Link href="/copyright" className="text-zinc-400 hover:text-white underline">
              Copyright
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-400">
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">UPI / GPay / Paytm</span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">Credit &amp; Debit Cards</span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">Cash on Delivery</span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">100% Secure SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
