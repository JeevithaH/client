'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from '@/components/stitch/announcement-bar';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer } from './cart-drawer';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { SocialProofToast } from './social-proof-toast';
import { ExitIntentModal } from './exit-intent-modal';
import { MobileBottomNav } from './mobile-bottom-nav';
import { AnnouncementMessage, SocialProofNotification, SiteSettings } from '@/lib/types';

let cachedConfig: {
  announcements?: AnnouncementMessage[];
  socialProof?: SocialProofNotification[];
  settings?: SiteSettings;
} | null = null;

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/nirvignastudio');

  const [announcements, setAnnouncements] = useState<AnnouncementMessage[]>(cachedConfig?.announcements || []);
  const [socialProof, setSocialProof] = useState<SocialProofNotification[]>(cachedConfig?.socialProof || []);
  const [settings, setSettings] = useState<SiteSettings | null>(cachedConfig?.settings || null);

  useEffect(() => {
    if (isAdmin) return;
    if (cachedConfig) {
      if (cachedConfig.announcements) setAnnouncements(cachedConfig.announcements);
      if (cachedConfig.socialProof) setSocialProof(cachedConfig.socialProof);
      if (cachedConfig.settings) setSettings(cachedConfig.settings);
      return;
    }

    fetch('/api/store/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          cachedConfig = {
            announcements: data.announcements,
            socialProof: data.socialProof,
            settings: data.settings,
          };
          if (data.announcements) setAnnouncements(data.announcements);
          if (data.socialProof) setSocialProof(data.socialProof);
          if (data.settings) setSettings(data.settings);
        }
      })
      .catch(() => {
        // Fallbacks will gracefully take over
      });
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
      <AnnouncementBar
        messages={announcements}
        supportPhone={settings?.support_phone || '+916395463874'}
        instagramUrl={settings?.instagram_url || 'https://instagram.com/stitchclothes'}
        facebookUrl={settings?.facebook_url || 'https://facebook.com/stitchclothes'}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <WhatsAppButton phoneNumber={settings?.whatsapp_number || '916395463874'} />
      <SocialProofToast notifications={socialProof} />
      <ExitIntentModal
        enabled={settings ? Boolean(settings.exit_intent_enabled) : true}
        couponCode={settings?.exit_intent_coupon || settings?.exit_intent_discount_code || 'STITCH10'}
      />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
