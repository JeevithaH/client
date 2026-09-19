'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Heart, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/context/toast-context';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { success } = useToast();

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);
  const variants = product.variants || [];
  
  // Available colors
  const colors = product.available_colors && product.available_colors.length > 0
    ? product.available_colors
    : [{ name: 'Default', hex: '#0E0E0E', image_url: variants[0]?.image_url || '' }];

  const currentColor = colors[selectedColor] || colors[0];

  // Images list
  const images: string[] = [
    currentColor.image_url,
    variants[0]?.secondary_image_url,
    ...variants.map(v => v.image_url)
  ].filter((img): img is string => Boolean(img));
  const uniqueImages: string[] = Array.from(new Set(images));

  // Active variant
  const activeVariant = variants.find(v => v.size === selectedSize && v.color_name === currentColor.name) ||
    variants.find(v => v.size === selectedSize) ||
    variants[0];

  const currentStock = activeVariant?.stock ?? 15;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (!activeVariant || isOutOfStock) return;
    addToCart(
      {
        id: `${product.id}-${activeVariant.id}-${selectedSize}`,
        productId: product.id,
        variantId: activeVariant.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compare_at_price,
        colorName: currentColor.name,
        colorHex: currentColor.hex,
        size: selectedSize,
        imageUrl: uniqueImages[activeImageIndex] || currentColor.image_url,
        maxStock: currentStock,
      },
      quantity
    );
    success('Added to Bag', `${product.title} (${selectedSize}) is ready.`);
    onClose();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-zinc-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/80 hover:bg-black hover:text-white text-zinc-700 transition-colors shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="md:w-1/2 bg-zinc-100 relative min-h-[300px] md:min-h-[480px] flex flex-col">
          <div className="relative flex-1 w-full overflow-hidden">
            <Image
              src={uniqueImages[activeImageIndex] || uniqueImages[0] || 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_11.png'}
              alt={product.title}
              fill
              className="object-cover object-center"
            />
            {discountPercent && (
              <span className="absolute top-3 left-3 bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {uniqueImages.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-zinc-200">
              {uniqueImages.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-16 shrink-0 border transition-all ${
                    activeImageIndex === idx ? 'border-black ring-1 ring-black' : 'border-zinc-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Variant Selection */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-400">
                Stitchclothes Official
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-[#0E0E0E] mt-1 font-sans">
                {product.title}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#0E0E0E]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-zinc-400 line-through">
                  ₹{product.compare_at_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {colors.length > 1 && (
              <div>
                <span className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">
                  Color: <span className="font-normal text-zinc-500">{currentColor.name}</span>
                </span>
                <div className="flex gap-2">
                  {colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedColor(idx);
                        setActiveImageIndex(0);
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === idx ? 'border-black ring-2 ring-black/20' : 'border-zinc-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === idx && (
                        <Check className={`w-3 h-3 ${c.hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-700">
                  Size: <span className="font-normal text-zinc-500">{selectedSize}</span>
                </span>
              </div>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-10 h-10 px-3 text-xs font-bold uppercase transition-all border ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">
                Quantity
              </span>
              <div className="inline-flex items-center border border-zinc-300 rounded-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm hover:bg-zinc-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="px-3 py-1.5 text-sm hover:bg-zinc-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-6 border-t border-zinc-200 mt-6">
            <div className="flex gap-3">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-white border border-[#0E0E0E] text-[#0E0E0E] hover:bg-zinc-50 text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="flex-1 py-3.5 bg-[#0E0E0E] hover:bg-zinc-800 text-white text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isOutOfStock ? 'Sold Out' : 'Buy Now'}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 rounded-xs border flex items-center justify-center transition-all ${
                  isFavorited ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-zinc-300 hover:border-black text-zinc-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full text-center block text-xs uppercase tracking-wider text-zinc-500 hover:text-black font-semibold pt-1"
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
