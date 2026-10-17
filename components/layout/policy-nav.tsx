'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Truck, RotateCcw, FileText, Copyright, HelpCircle } from 'lucide-react';

const POLICY_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy', icon: ShieldCheck },
  { href: '/shipping-policy', label: 'Delivery & Shipping', icon: Truck },
  { href: '/refund-policy', label: 'Returns & Refunds', icon: RotateCcw },
  { href: '/terms', label: 'Terms of Service', icon: FileText },
  { href: '/copyright', label: 'Copyright', icon: Copyright },
  { href: '/contact', label: 'Contact Us', icon: HelpCircle },
];

export function PolicyNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-zinc-200 bg-white sticky top-16 z-20 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-3 no-scrollbar text-xs">
          {POLICY_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href === '/privacy-policy' && pathname === '/privacy') ||
              (link.href === '/shipping-policy' && pathname === '/delivery-policy') ||
              (link.href === '/refund-policy' && pathname === '/returns-policy') ||
              (link.href === '/terms' && pathname === '/terms-and-conditions');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
