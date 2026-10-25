import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { AuthProvider } from '@/context/auth-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { ToastProvider } from '@/context/toast-context';
import { StoreShell } from '@/components/layout/store-shell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'AVIVEKY | Premium Streetwear & Anime Apparel Atelier',
  description:
    'Exclusive streetwear drops, anime graphic apparel, heavyweight 400 GSM hoodies & oversized combed cotton t-shirts.',
  keywords: 'aviveky, streetwear, anime hoodies, oversized t-shirts, heavyweight fleece, graphic tees',
  openGraph: {
    title: 'AVIVEKY | Premium Streetwear & Anime Apparel Atelier',
    description:
      'Exclusive streetwear drops, anime graphic apparel, heavyweight 400 GSM hoodies & oversized combed cotton t-shirts.',
    url: 'https://shipfold.com',
    siteName: 'AVIVEKY Atelier',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1625910513413-5bc50b925b6a?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'AVIVEKY Apparel',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <style>{`
          :root {
            --bs-link-color: inherit !important;
            --bs-link-hover-color: inherit !important;
            --bs-link-decoration: none !important;
            --bs-link-hover-decoration: none !important;
          }
          a, a:hover, a:focus, a:active, .btn, .nav-link, button {
            text-decoration: none !important;
            color: inherit;
          }
          a *, a:hover *, a:focus * {
            text-decoration: none !important;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: '#0C1427',
              colorText: '#18181b',
              colorBackground: '#FAF8F5',
            },
          }}
        >
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <StoreShell>{children}</StoreShell>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
