'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useWishlist } from '@/context/wishlist-context';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import { getWhatsAppConciergeUrl } from '@/lib/whatsapp';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleMoveToBag = (product: any) => {
    const defaultVariant = product.variants?.[0];
    const size = product.available_sizes?.[0] || 'M';
    const color = product.available_colors?.[0] || {
      name: defaultVariant?.color_name || 'Standard',
      hex: defaultVariant?.color_hex || '#0C1427',
      image_url: defaultVariant?.image_url || '',
    };

    addToCart({
      id: `${product.id}-${defaultVariant?.id || 'std'}-${size}`,
      productId: product.id,
      variantId: defaultVariant?.id || 'std',
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      colorName: color.name,
      colorHex: color.hex,
      size: size,
      imageUrl: color.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900',
      maxStock: defaultVariant?.stock || 10,
    });

    removeFromWishlist(product.id);
    success('Moved to Shopping Bag', `${product.title} (${size}) placed in your bag.`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-400 mb-6">
          <Heart className="w-10 h-10 text-[#C5A880]" />
        </div>
        <h1 className="font-serif text-3xl font-normal text-zinc-900">Your Wishlist is Empty</h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mt-2 font-light leading-relaxed">
          Save your most coveted garments from our collection of Supima® cotton, Mercerized Giza 88 polos, and luxury henleys.
        </p>
        <Link
          href="/shop"
          className="mt-8 px-8 py-3.5 bg-[#0C1427] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#1B2541] transition-all shadow-md"
        >
          Discover The Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B6B38] font-bold">
              Personal Portfolio
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-900 mt-1">
              Curated Desires ({wishlist.length})
            </h1>
          </div>
          <a
            href={getWhatsAppConciergeUrl(encodeURIComponent('Greetings Shipfold Concierge, I have saved ' + wishlist.length + ' garments in my wishlist and would love styling recommendations.'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-800 hover:text-emerald-950 self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Consult Concierge on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const displayImg =
              product.variants?.[0]?.image_url ||
              product.available_colors?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900';

            return (
              <div
                key={product.id}
                className="bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between group hover:border-zinc-400 transition-all"
              >
                <div className="relative aspect-[3/4] w-full bg-[#FAF8F5] overflow-hidden">
                  <Link href={'/product/' + product.slug} className="block w-full h-full">
                    <Image
                      src={displayImg}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-zinc-400 hover:text-rose-600 shadow-sm transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8B6B38] font-medium block">
                      {product.category_name || product.fit || 'Bespoke Atelier'}
                    </span>
                    <Link
                      href={'/product/' + product.slug}
                      className="font-serif text-base font-medium text-zinc-900 hover:text-black transition-colors line-clamp-1 mt-0.5"
                    >
                      {product.title}
                    </Link>
                    {product.tagline && (
                      <p className="text-[11px] text-zinc-500 line-clamp-1 font-light mt-0.5">
                        {product.tagline}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-base font-semibold text-zinc-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-xs text-zinc-400 line-through">
                          ₹{product.compare_at_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="flex-1 py-2.5 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
