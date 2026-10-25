'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Heart,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { SearchModal } from './search-modal';
import { CONCIERGE_PHONE_DISPLAY } from '@/lib/whatsapp';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user: clerkUser, isSignedIn: isClerkSignedIn } = useUser();
  const clerk = useClerk();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAuthenticated = isClerkSignedIn || !!session?.user;
  const displayName =
    clerkUser?.fullName ||
    clerkUser?.primaryEmailAddress?.emailAddress ||
    session?.user?.name ||
    session?.user?.email;

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('shipfold_checkout_draft');
      }
      if (isClerkSignedIn) {
        await clerk.signOut();
      }
      if (session?.user) {
        await signOut({ redirect: false });
      }
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 1. Left: Brand Logo */}
            <div className="flex items-center gap-6">
              {/* Mobile Hamburger Toggle (only visible on mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-900 hover:text-black focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/" className="flex flex-col">
                <span className="font-sans text-2xl font-black tracking-[0.2em] text-[#0E0E0E] uppercase leading-none">
                  STiTCH
                </span>
                <span className="text-[8px] uppercase tracking-[0.35em] text-zinc-400 font-bold mt-1">
                  Streetwear Atelier
                </span>
              </Link>
            </div>

            {/* 2. Center: Clean Horizontal Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-7">
              <Link
                href="/collections/all"
                className={`text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${
                  pathname === '/collections/all' || pathname === '/shop'
                    ? 'text-[#0E0E0E] font-bold border-b border-[#0E0E0E] pb-1'
                    : 'text-zinc-600 hover:text-black luxury-link'
                }`}
              >
                All Drops
              </Link>

              <Link
                href="/collections/hoodies"
                className={`text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${
                  pathname === '/collections/hoodies'
                    ? 'text-[#0E0E0E] font-bold border-b border-[#0E0E0E] pb-1'
                    : 'text-zinc-600 hover:text-black luxury-link'
                }`}
              >
                Hoodies
              </Link>

              <Link
                href="/collections/oversized-t-shirt"
                className={`text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${
                  pathname === '/collections/oversized-t-shirt'
                    ? 'text-[#0E0E0E] font-bold border-b border-[#0E0E0E] pb-1'
                    : 'text-zinc-600 hover:text-black luxury-link'
                }`}
              >
                Oversized
              </Link>

              <Link
                href="/custom"
                className={`text-xs uppercase tracking-[0.18em] font-bold transition-colors flex items-center gap-1.5 ${
                  pathname === '/custom'
                    ? 'text-[#DC2626] font-bold border-b border-[#DC2626] pb-1'
                    : 'text-zinc-900 hover:text-[#DC2626] luxury-link'
                }`}
              >
                <span>Custom Orders</span>
                <span className="text-[8px] uppercase tracking-wider font-extrabold bg-black text-white px-1.5 py-0.5 shadow-xs">
                  Bulk
                </span>
              </Link>
            </nav>

            {/* 3. Right: Utility Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-zinc-700 hover:text-black transition-colors"
                aria-label="Search T-shirts"
                title="Search"
              >
                <Search className="w-4 h-4 stroke-[1.75]" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-zinc-700 hover:text-black transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-0.5 bg-[#0E0E0E] text-white text-[9px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account */}
              {isClerkSignedIn ? (
                <div className="flex items-center gap-2 pl-1">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7 ring-1 ring-zinc-300",
                      },
                    }}
                  />
                  <Link
                    href="/account"
                    className="hidden sm:inline text-[11px] uppercase tracking-wider text-zinc-600 hover:text-black font-medium"
                  >
                    Account
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 text-zinc-700 hover:text-black transition-colors"
                    aria-label="User Account"
                    title="Account"
                  >
                    <UserIcon className="w-4 h-4 stroke-[1.75]" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-3 w-56 bg-white shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      {isAuthenticated ? (
                        <div className="px-4 py-2 border-b border-zinc-100 mb-1">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-400">Signed In As</p>
                          <p className="text-xs font-semibold text-zinc-900 truncate mt-0.5">
                            {displayName}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2 border-b border-zinc-100 mb-1 space-y-1">
                          <Link
                            href="/login"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block w-full py-1.5 text-center text-xs uppercase tracking-wider bg-[#0E0E0E] text-white font-medium hover:bg-zinc-800 transition-colors"
                          >
                            Sign In
                          </Link>
                        </div>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-black"
                      >
                        My Orders &amp; Tracking
                      </Link>
                      <Link
                        href="/account?tab=addresses"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-black"
                      >
                        Saved Addresses
                      </Link>

                      {isAuthenticated && (
                        <div className="pt-1 border-t border-zinc-100 mt-1">
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 bg-[#0E0E0E] text-white hover:bg-zinc-800 transition-colors shadow-sm"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">
                  Bag ({itemCount})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Clean, Simple Mobile Menu Dropdown (Uncluttered) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <nav className="space-y-3">
              <Link
                href="/collections/all"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-semibold text-zinc-900 hover:text-black"
              >
                All Streetwear Drops
              </Link>
              <Link
                href="/collections/hoodies"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-semibold text-zinc-800 hover:text-black"
              >
                Hoodies &amp; Sweatshirts
              </Link>
              <Link
                href="/collections/oversized-t-shirt"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-semibold text-zinc-800 hover:text-black"
              >
                Oversized T-Shirts
              </Link>
              <Link
                href="/custom"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-bold text-[#DC2626]"
              >
                Custom &amp; Bulk Orders
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-widest text-zinc-500 hover:text-black pt-2 border-t border-zinc-100"
              >
                Track Orders &amp; Profile
              </Link>
            </nav>

            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs">
              <a
                href="tel:+918310274918"
                className="text-zinc-800 font-semibold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-black" />
                <span>+91 8310274918</span>
              </a>
              <a
                href="https://wa.me/918310274918?text=Hello%20STiTCH%2C%20I%20would%20like%20to%20inquire%20about%20orders."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-semibold flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
