'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  // Hide on admin backoffice
  if (pathname?.startsWith('/nirvignastudio') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-2 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/' ? 'text-black' : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </Link>

        <Link
          href="/collections/all"
          className={`flex flex-col items-center gap-1 ${
            pathname?.startsWith('/collections') || pathname === '/shop'
              ? 'text-black'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Compass className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Shop</span>
        </Link>

        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center gap-1 ${
            pathname === '/wishlist' ? 'text-black' : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Heart className="w-5 h-5 stroke-[1.75]" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-1.5 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wider">Wishlist</span>
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-700"
          aria-label="Open Bag"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
          {itemCount > 0 && (
            <span className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wider">Bag</span>
        </button>

        <Link
          href="/account"
          className={`flex flex-col items-center gap-1 ${
            pathname?.startsWith('/account') || pathname === '/login'
              ? 'text-black'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Account</span>
        </Link>
      </div>
    </div>
  );
}
