'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Share2, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { AnnouncementMessage } from '@/lib/types';

interface AnnouncementBarProps {
  messages?: AnnouncementMessage[];
  supportPhone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export function AnnouncementBar({
  messages = [],
  supportPhone = '+916395463874',
  instagramUrl = 'https://instagram.com/stitchclothes',
  facebookUrl = 'https://facebook.com/stitchclothes',
}: AnnouncementBarProps) {
  const defaultMessages: AnnouncementMessage[] = [
    { id: '1', message: 'Sign up for 10% off your first order.', link_url: '/account', display_order: 1, is_active: true },
    { id: '2', message: 'New Year sale discount off 50%.', link_url: '/collections/hot-sale', display_order: 2, is_active: true },
    { id: '3', message: 'Every Sunday 30% Off.', link_url: '/collections/all', display_order: 3, is_active: true },
  ];

  const activeMessages = messages.length > 0 ? messages.filter(m => m.is_active) : defaultMessages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeMessages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeMessages.length, isPaused]);

  const current = activeMessages[currentIndex] || activeMessages[0];

  return (
    <div
      className="bg-[#0E0E0E] text-white text-[11px] border-b border-zinc-800 transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        {/* Left: Social Media Links */}
        <div className="hidden md:flex items-center space-x-3 text-zinc-400">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="Instagram"
            aria-label="Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <span className="text-zinc-600">|</span>
          <span className="text-[10px] tracking-wider uppercase text-zinc-400">Official Atelier</span>
        </div>

        {/* Center: Sliding Promo Ticker */}
        <div className="flex-1 flex items-center justify-center text-center px-4 overflow-hidden">
          <div className="flex items-center gap-2">
            {activeMessages.length > 1 && (
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + activeMessages.length) % activeMessages.length)}
                className="text-zinc-500 hover:text-white p-0.5 transition-colors"
                aria-label="Previous Announcement"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            )}

            <div className="animate-in fade-in duration-300 truncate">
              {current?.link_url ? (
                <Link
                  href={current.link_url}
                  className="hover:underline underline-offset-4 tracking-wide font-medium text-white flex items-center gap-1.5"
                >
                  <span>{current.message}</span>
                  <span className="text-[10px] uppercase font-bold text-[#EAB308] bg-zinc-900 px-1.5 py-0.5 rounded-xs border border-zinc-700">
                    Claim
                  </span>
                </Link>
              ) : (
                <span className="tracking-wide text-zinc-200">{current?.message}</span>
              )}
            </div>

            {activeMessages.length > 1 && (
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeMessages.length)}
                className="text-zinc-500 hover:text-white p-0.5 transition-colors"
                aria-label="Next Announcement"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Customer Concierge */}
        <div className="hidden sm:flex items-center space-x-4 text-[10px] uppercase tracking-wider text-zinc-400">
          <a
            href={`tel:${supportPhone}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>{supportPhone}</span>
          </a>
          <Link href="/pages/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
