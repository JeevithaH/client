'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, CheckCircle, ShoppingBag } from 'lucide-react';
import { SocialProofNotification } from '@/lib/types';

interface SocialProofToastProps {
  notifications?: SocialProofNotification[];
  enabled?: boolean;
  intervalSec?: number;
}

export function SocialProofToast({
  notifications = [],
  enabled = true,
  intervalSec = 12,
}: SocialProofToastProps) {
  const defaultNotifications: SocialProofNotification[] = [
    {
      id: 'sp-1',
      product_title: 'Balaclava Hoodie | STiTCH Limited Edition',
      product_image: 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_11.png',
      product_url: '/product/balaclava-hoodie-stitch-limited-edition',
      city: 'Mumbai, Maharashtra',
      time_ago: '2 minutes ago',
      is_active: true,
    },
    {
      id: 'sp-2',
      product_title: 'Shadow Monarch Anime Hoodie',
      product_image: 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_3.png',
      product_url: '/product/shadow-monarch-anime-hoodie',
      city: 'Bengaluru, Karnataka',
      time_ago: '4 minutes ago',
      is_active: true,
    },
    {
      id: 'sp-3',
      product_title: 'Sukuna Anime Hoodie',
      product_image: 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_6.png',
      product_url: '/product/sukuna-anime-hoodie',
      city: 'Delhi NCR',
      time_ago: '6 minutes ago',
      is_active: true,
    },
  ];

  const activeItems = notifications.length > 0 ? notifications.filter(n => n.is_active) : defaultNotifications;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || dismissed || activeItems.length === 0) return;

    // Initial delay before first popup
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, [enabled, dismissed, activeItems.length]);

  useEffect(() => {
    if (!enabled || dismissed || activeItems.length === 0) return;

    // Timer to cycle notifications
    const cycle = setInterval(() => {
      // Hide
      setIsVisible(false);

      // Wait 3 seconds, switch to next, show again
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % activeItems.length);
        setIsVisible(true);
      }, 3000);
    }, (intervalSec || 12) * 1000);

    return () => clearInterval(cycle);
  }, [enabled, dismissed, activeItems.length, intervalSec]);

  if (!enabled || dismissed || activeItems.length === 0 || !isVisible) return null;
  const item = activeItems[currentIdx];

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border border-zinc-200 shadow-2xl rounded-xs p-3 flex items-center gap-3 relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs hover:bg-black transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Product Thumbnail */}
        <div className="relative w-14 h-16 shrink-0 bg-zinc-100 rounded-xs overflow-hidden border border-zinc-100">
          <Image
            src={item.product_image || item.product_image_url || 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_11.png'}
            alt={item.product_title}
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-zinc-500 font-medium">
            Someone in <span className="text-zinc-900 font-bold">{item.city}</span> purchased
          </p>
          <Link
            href={item.product_url || '/collections/all'}
            className="text-xs font-bold text-[#0E0E0E] hover:underline truncate block mt-0.5"
          >
            {item.product_title}
          </Link>
          <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle className="w-2.5 h-2.5" /> Verified Order • {item.time_ago || 'recently'}
          </p>
        </div>
      </div>
    </div>
  );
}
