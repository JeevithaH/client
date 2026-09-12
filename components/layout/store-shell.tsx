'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from './announcement-bar';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer } from './cart-drawer';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/nirvignastudio');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
