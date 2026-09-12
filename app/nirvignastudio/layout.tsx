'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Tag,
  Boxes,
  Users,
  ExternalLink,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  Image as ImageIcon,
  Truck,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/nirvignastudio', icon: LayoutDashboard },
  { label: 'Shipping & Delivery', href: '/nirvignastudio/shipping', icon: Truck },
  { label: 'Ad & Placements', href: '/nirvignastudio/placements', icon: ImageIcon },
  { label: 'Product Archive', href: '/nirvignastudio/products', icon: Shirt },
  { label: 'Client Orders', href: '/nirvignastudio/orders', icon: ShoppingBag },
  { label: 'Privilege Coupons', href: '/nirvignastudio/coupons', icon: Tag },
  { label: 'Inventory & Stock', href: '/nirvignastudio/inventory', icon: Boxes },
  { label: 'Patron Registry', href: '/nirvignastudio/users', icon: Users },
];

export default function NirvignaStudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useUser();
  const clerk = useClerk();

  // If on login page, render without sidebar
  const isLoginPage = pathname === '/nirvignastudio/login';
  const isAuthLoaded = isClerkLoaded && status !== 'loading';

  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
  const isAdminEmail =
    clerkEmail === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'test@gmail.com').toLowerCase() ||
    clerkEmail === 'jeevithah648@gmail.com';
  const isClerkAdmin = isClerkSignedIn && (clerkUser?.publicMetadata?.role === 'admin' || isAdminEmail);
  const isSessionAdmin = (session?.user as unknown as { role?: string })?.role === 'admin';
  const isAdmin = isClerkAdmin || isSessionAdmin;

  useEffect(() => {
    if (!isLoginPage && isAuthLoaded && !isAdmin) {
      router.push('/nirvignastudio/login');
    }
  }, [isAuthLoaded, isAdmin, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#FAFAFA]">{children}</div>;
  }

  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black font-sans text-xs tracking-[0.25em] uppercase">
        Verifying Administrative Credentials...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-zinc-300 p-8 text-center text-black space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-black mx-auto stroke-[1.5]" />
          <h2 className="font-sans text-xl font-bold uppercase tracking-wider">Access Restricted</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Your current account does not hold Director permissions to access Nirvigna Studio.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/nirvignastudio/login"
              className="px-5 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors"
            >
              Director Login
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 border border-zinc-300 text-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-colors"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col lg:flex-row">
      {/* Sidebar: Plain Black & White Premium */}
      <aside className="w-full lg:w-64 bg-[#0A0A0A] text-white flex flex-col justify-between shrink-0 border-r border-zinc-800">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-zinc-800">
            <Link href="/nirvignastudio" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs tracking-wider">
                NS
              </div>
              <div>
                <span className="font-sans text-base font-bold tracking-[0.2em] text-white uppercase block leading-none">
                  Nirvigna
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-medium block mt-1">
                  Studio Director
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-semibold px-3 py-2">
              Management
            </p>
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/nirvignastudio' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-all ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-xs'
                      : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User & Storefront Link */}
        <div className="p-4 border-t border-zinc-800 space-y-2 bg-[#000000]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> Public Store
            </span>
            <span className="text-[9px] uppercase tracking-widest bg-zinc-800 px-1.5 py-0.5 text-white font-medium">Live</span>
          </Link>

          <div className="pt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-white truncate max-w-[110px]">
                  {clerkUser?.fullName || session?.user?.name || 'Director'}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">Admin</p>
              </div>
            </div>

            <button
              onClick={async () => {
                if (isClerkSignedIn) {
                  await clerk.signOut();
                }
                if (session?.user) {
                  signOut({ callbackUrl: '/nirvignastudio/login' });
                } else {
                  router.push('/nirvignastudio/login');
                }
              }}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area: Pure Crisp White */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
