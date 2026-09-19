'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Check, Plus, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/context/toast-context';
import { QuickViewModal } from './quick-view-modal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [userChosenColor, setUserChosenColor] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.available_sizes?.[0] || 'M'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [mobileQuickAddOpen, setMobileQuickAddOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const colors = product.available_colors || [];
  const currentColor = colors[selectedColorIndex] || {
    name: product.variants?.[0]?.color_name || 'Standard',
    hex: product.variants?.[0]?.color_hex || '#000000',
    image_url: product.variants?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
  };

  // Secondary image for hover flip only if user hasn't explicitly clicked a color
  const matchingVariant = product.variants?.find((v) => v.color_name === currentColor.name);
  const secondaryImage = matchingVariant?.secondary_image_url;

  const displayImage = (!userChosenColor && isHovered && secondaryImage)
    ? secondaryImage
    : currentColor.image_url;

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    const matchingVariant =
      product.variants?.find(
        (v) => v.color_name === currentColor.name && v.size === size
      ) ||
      product.variants?.find((v) => v.size === size) ||
      product.variants?.[0];

    if (!matchingVariant) return;

    addToCart({
      id: `${product.id}-${matchingVariant.id}-${size}`,
      productId: product.id,
      variantId: matchingVariant.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      colorName: currentColor.name,
      colorHex: currentColor.hex,
      size: size,
      imageUrl: currentColor.image_url,
      maxStock: matchingVariant.stock,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    success('Added to Bag', `${product.title} (${size}) placed in your bag.`);
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div
      className="group relative flex flex-col bg-white transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#F6F5F3] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={displayImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
          />
        </Link>

        {/* Minimalist Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="bg-[#DC2626] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 shadow-xs">
              -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-[#0E0E0E] text-white text-[9px] uppercase tracking-[0.25em] font-medium px-2 py-0.5">
              Bestseller
            </span>
          )}
          {product.is_new && (
            <span className="bg-[#F6F5F3] text-[#0E0E0E] border border-zinc-300 text-[9px] uppercase tracking-[0.25em] font-medium px-2 py-0.5">
              New
            </span>
          )}
        </div>

        {/* Action Buttons: Wishlist & Quick View */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-full transition-all ${
              isFavorited
                ? 'bg-white text-rose-600 shadow-sm'
                : 'bg-white/80 hover:bg-white text-zinc-600 hover:text-black shadow-xs'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-black shadow-xs transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Quick Add Floating Trigger Button */}
        <div className="absolute bottom-2.5 right-2.5 z-10 sm:hidden">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileQuickAddOpen(!mobileQuickAddOpen);
            }}
            className="w-8 h-8 rounded-full bg-[#0C1427]/90 text-white shadow-md flex items-center justify-center hover:bg-black active:scale-95 transition-all"
            aria-label="Quick Select Size"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Quick Size Selector on Hover or Mobile Tap */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-3 border-t border-zinc-200 transition-all duration-300 flex items-center justify-between z-20 ${
            isHovered || mobileQuickAddOpen
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-zinc-700">
            Quick Add:
          </span>
          <div className="flex items-center gap-1.5">
            {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
              const isAvailable = product.available_sizes?.includes(sz);
              return (
                <button
                  key={sz}
                  disabled={!isAvailable}
                  onClick={(e) => {
                    setSelectedSize(sz);
                    handleQuickAdd(e, sz);
                    setMobileQuickAddOpen(false);
                  }}
                  className={`w-7 h-7 text-[11px] font-sans font-medium transition-all flex items-center justify-center rounded-full ${
                    !isAvailable
                      ? 'text-zinc-300 cursor-not-allowed line-through'
                      : sz === selectedSize && justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'border border-zinc-300 hover:border-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white text-zinc-800 bg-white'
                  }`}
                  title={isAvailable ? `Add Size ${sz}` : 'Out of Stock'}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="pt-3 pb-2 flex flex-col flex-1 bg-white">
        {/* Color Dots */}
        {colors.length > 1 && (
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              {colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColorIndex(idx);
                    setUserChosenColor(true);
                  }}
                  className={`w-3.5 h-3.5 rounded-full transition-all border border-black/10 ${
                    idx === selectedColorIndex
                      ? 'ring-2 ring-offset-2 ring-[#0E0E0E] scale-110'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
            <span className="text-[10px] text-zinc-500 font-medium tracking-wide">
              {currentColor.name}
            </span>
          </div>
        )}

        {/* Product Title */}
        <Link href={`/product/${product.slug}`} className="block group-hover:opacity-75 transition-opacity">
          <h3 className="font-sans text-xs sm:text-sm font-medium text-[#0E0E0E] tracking-[0.05em] line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Category / Silhouette */}
        <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 mt-0.5 block">
          {product.category_name || product.fit}
        </span>

        {/* Pricing */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xs sm:text-sm font-medium text-[#0E0E0E]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.compare_at_price && (
            <span className="text-[11px] text-zinc-400 line-through">
              ₹{product.compare_at_price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
