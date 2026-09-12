'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  ChevronDown,
  Check,
  AlertCircle,
  Share2,
  Heart,
  MessageCircle,
  MessageSquare,
  Users,
  Flame,
  Tag,
  BatteryMedium,
  BatteryWarning,
  Sparkles,
  Zap,
  Copy,
} from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/context/toast-context';
import { getWhatsAppProductOrderUrl } from '@/lib/whatsapp';
import { ProductCard } from '@/components/shop/product-card';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection states
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);

  // Live viewers simulation & urgent counter
  const [activeViewers, setActiveViewers] = useState(14);
  useEffect(() => {
    // Generate organic luxury viewing numbers between 11 and 28
    const interval = setInterval(() => {
      setActiveViewers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + delta;
        return next < 8 ? 12 : next > 34 ? 22 : next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string>('fabric');

  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [patronReviewRating, setPatronReviewRating] = useState(5);
  const [patronReviewComment, setPatronReviewComment] = useState('');
  const [patronReviewAuthor, setPatronReviewAuthor] = useState('');
  const [patronReviews, setPatronReviews] = useState([
    {
      author: 'Lord Julian Sterling',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      text: 'Remarkable staple length and drape. The mercerization process bestows an elusive luster that outperforms Italian luxury houses costing four times as much.',
    },
    {
      author: 'Vikramaditya S.',
      rating: 5,
      date: '1 month ago',
      verified: true,
      text: 'Impeccable collar structure that refuses to curl. A tailored gentlemanly silhouette without any pull under an unconstructed jacket.',
    },
  ]);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patronReviewAuthor.trim() || !patronReviewComment.trim()) return;
    setPatronReviews([
      {
        author: patronReviewAuthor.trim(),
        rating: patronReviewRating,
        date: 'Just now',
        verified: true,
        text: patronReviewComment.trim(),
      },
      ...patronReviews,
    ]);
    success('Review Recorded', 'Your patronage assessment has been added to this garment portfolio.');
    setReviewModalOpen(false);
    setPatronReviewAuthor('');
    setPatronReviewComment('');
  };

  const isFavorited = product ? isInWishlist(product.id) : false;

  const getPDPWhatsAppUrl = () => {
    if (!product) return '#';
    return getWhatsAppProductOrderUrl({
      product,
      color: currentColor.name,
      size: selectedSize,
      quantity,
    });
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product.available_sizes?.length) {
            setSelectedSize(data.product.available_sizes[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-serif text-lg text-zinc-700">
        Presenting Garment Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <h2 className="font-serif text-2xl text-zinc-900">Garment Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1">This piece may have been retired to the archive.</p>
        <Link
          href="/shop"
          className="mt-6 px-6 py-2.5 bg-[#0C1427] text-white text-xs uppercase tracking-widest"
        >
          Return to The Collection
        </Link>
      </div>
    );
  }

  const colors = product.available_colors || [];
  const currentColor = colors[selectedColorIndex] || {
    name: product.variants?.[0]?.color_name || 'Standard',
    hex: product.variants?.[0]?.color_hex || '#0C172D',
    image_url: product.variants?.[0]?.image_url || '',
  };

  // Find all images for this colourway
  const matchingVariants = product.variants?.filter((v) => v.color_name === currentColor.name) || [];
  const galleryImages: string[] = [];
  matchingVariants.forEach((v) => {
    if (v.image_url && !galleryImages.includes(v.image_url)) {
      galleryImages.push(v.image_url);
    }
    if (v.secondary_image_url && !galleryImages.includes(v.secondary_image_url)) {
      galleryImages.push(v.secondary_image_url);
    }
  });
  if (galleryImages.length === 0 && currentColor.image_url) {
    galleryImages.push(currentColor.image_url);
  }

  // Active Variant based on color + size
  const activeVariant =
    product.variants?.find(
      (v) => v.color_name === currentColor.name && v.size === selectedSize
    ) ||
    product.variants?.find((v) => v.size === selectedSize) ||
    product.variants?.[0];

  const currentStock = activeVariant?.stock ?? 10;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

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
        imageUrl: galleryImages[0] || currentColor.image_url,
        maxStock: currentStock,
      },
      quantity
    );

    success('Placed in Bag', `${product.title} (${selectedSize}) is ready.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <div className="bg-[#FFFFFF] min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-zinc-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3 text-[10px] text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">
            T-Shirts
          </Link>
          <span>/</span>
          <span className="text-[#0E0E0E] font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: High-Res Vertical Photo Stream & Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] w-full bg-[#F6F5F3] overflow-hidden group">
              <Image
                src={galleryImages[activeImageIndex] || galleryImages[0]}
                alt={product.title}
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />

              {/* Minimal Tag */}
              {discountPercent && (
                <div className="absolute top-4 left-4 bg-[#0E0E0E] text-white text-[9px] font-medium px-3 py-1 uppercase tracking-[0.25em]">
                  Privilege {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 bg-[#F6F5F3] transition-all shrink-0 ${
                      idx === activeImageIndex
                        ? 'ring-1 ring-[#0E0E0E]'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Garment Information & Purchasing (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div>
              {/* Category & Reference SKU */}
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-zinc-400 font-medium mb-1.5">
                <span>{product.category_name || product.fit}</span>
                <span>REF. SHP-0{product.id}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0E0E0E] font-normal leading-snug">
                {product.title}
              </h1>

              {/* Pricing */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-sans font-medium text-[#0E0E0E]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compare_at_price && (
                  <span className="text-xs text-zinc-400 line-through">
                    ₹{product.compare_at_price.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[10px] text-zinc-400 ml-auto">Taxes & duties included</span>
              </div>
            </div>

            {/* Real-time Viewing Counter Banner */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F6F5F3] text-xs text-zinc-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E0E0E]"></span>
              </span>
              <div className="flex items-center gap-1.5 flex-1">
                <Users className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-[11px] text-zinc-700">
                  <strong className="font-medium text-[#0E0E0E]">{activeViewers} patrons</strong> are examining this piece currently.
                </span>
              </div>
            </div>

            {/* Privilege Offers Concession Box */}
            <div className="p-4 border border-zinc-200 bg-white space-y-2.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#0E0E0E]">
                    Client Privileges
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
                  2 Applicable
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Offer 1 */}
                <div className="p-2.5 bg-[#F6F5F3] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#0E0E0E] bg-white px-1.5 py-0.5 text-[10px] border border-zinc-200">
                        SHIP10
                      </span>
                      <span className="text-zinc-800 text-[11px]">10% Inaugural savings</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('SHIP10');
                      success('Code Copied', 'SHIP10 copied to clipboard');
                    }}
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#0E0E0E] hover:opacity-75 transition-opacity flex items-center gap-1 luxury-link"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>

                {/* Offer 2 */}
                <div className="p-2.5 bg-[#F6F5F3] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#0E0E0E] bg-white px-1.5 py-0.5 text-[10px] border border-zinc-200">
                        LUXE500
                      </span>
                      <span className="text-zinc-800 text-[11px]">Flat ₹500 concession &gt; ₹2,499</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('LUXE500');
                      success('Code Copied', 'LUXE500 copied to clipboard');
                    }}
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#0E0E0E] hover:opacity-75 transition-opacity flex items-center gap-1 luxury-link"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Colourway Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.2em] font-medium text-zinc-500 text-[10px]">
                  Color: <strong className="text-[#0E0E0E]">{currentColor.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((c, idx) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      setActiveImageIndex(0);
                    }}
                    className={`w-7 h-7 rounded-full border border-black/15 transition-all flex items-center justify-center relative ${
                      idx === selectedColorIndex
                        ? 'ring-2 ring-offset-2 ring-[#0E0E0E] scale-110 shadow-sm'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={c.name}
                  >
                    {idx === selectedColorIndex && (
                      <Check className={`w-3.5 h-3.5 ${['#ffffff', '#f8f8f8', '#fafafa', '#ece6dc', '#f4efea', '#d7c9b8', '#efe8dc', '#f7f3e9'].includes(c.hex.toLowerCase()) ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.2em] font-medium text-zinc-500 text-[10px]">
                  Size: <strong className="text-[#0E0E0E]">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOpenAccordion('sizing')}
                  className="text-zinc-500 luxury-underline uppercase text-[10px] tracking-widest font-medium hover:text-black transition-colors"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const variantForSize = product.variants?.find(
                    (v) => v.color_name === currentColor.name && v.size === sz
                  );
                  const isAvailable = variantForSize && variantForSize.stock > 0;

                  return (
                    <button
                      key={sz}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 text-xs font-sans font-medium transition-all rounded-full border ${
                        !isAvailable
                          ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed line-through'
                          : selectedSize === sz
                          ? 'bg-[#0E0E0E] text-white border-[#0E0E0E]'
                          : 'bg-white text-zinc-800 border-zinc-300 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Real-time Battery Percentage Stock Gauge */}
              {(() => {
                const maxBenchmark = 25;
                const batteryPct = Math.min(100, Math.max(8, Math.round((currentStock / maxBenchmark) * 100)));
                const batteryColor =
                  isOutOfStock
                    ? 'bg-zinc-400'
                    : isLowStock
                    ? 'bg-rose-600'
                    : currentStock <= 12
                    ? 'bg-amber-500'
                    : 'bg-[#0E0E0E]';

                return (
                  <div className="p-3 bg-[#F6F5F3] space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <BatteryMedium className="w-3.5 h-3.5 text-zinc-700" />
                        <span className="text-[11px] text-zinc-700">
                          {isOutOfStock
                            ? 'Stock Depleted'
                            : `${currentStock} piece${currentStock > 1 ? 's' : ''} left in atelier`}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        {isOutOfStock ? '0%' : `${batteryPct}% available`}
                      </span>
                    </div>

                    {/* Minimalist Battery Bar */}
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-2 bg-zinc-200 rounded-xs p-0.5 flex items-center">
                        <div
                          className={`h-full transition-all duration-700 ${batteryColor}`}
                          style={{ width: `${isOutOfStock ? 0 : batteryPct}%` }}
                        />
                      </div>
                      <div className="w-0.5 h-1.5 bg-zinc-300 rounded-r-xs" />
                    </div>

                    {isLowStock && (
                      <p className="text-[10px] text-rose-600 font-medium tracking-wide">
                        Limited availability — reserved upon bag placement.
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* CTAs: Place in Cart & WhatsApp & Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3 items-center">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-full bg-[#0E0E0E] hover:bg-zinc-800 text-white text-[11px] uppercase tracking-[0.25em] font-medium transition-all shadow-md disabled:opacity-50"
                >
                  {isOutOfStock ? 'Sold Out' : 'Place in Cart'}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => product && toggleWishlist(product)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-zinc-300 hover:border-black text-zinc-700 bg-white'
                  }`}
                  title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              {/* Order via WhatsApp CTA */}
              <a
                href={getPDPWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-white border border-[#0E0E0E] text-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white text-[11px] uppercase tracking-[0.22em] font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order via WhatsApp (8310246790)</span>
              </a>


              <div className="pt-2 flex items-center justify-around text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <span>Complimentary Delivery</span>
                <span>•</span>
                <span>14-Day Exchanges</span>
                <span>•</span>
                <span>Authentic Supima®</span>
              </div>
            </div>

            {/* Pincode Availability Checker */}
            <div className="p-4 border border-zinc-200 bg-white space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 block">
                Estimated Delivery
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    setPincodeChecked(false);
                  }}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-2 text-xs bg-[#F6F5F3] font-mono focus:outline-none"
                />
                <button
                  onClick={() => setPincodeChecked(true)}
                  disabled={pincode.length < 6}
                  className="px-5 py-2 rounded-full bg-[#0E0E0E] text-white text-[10px] uppercase tracking-widest font-medium disabled:opacity-40"
                >
                  Check
                </button>
              </div>
              {pincodeChecked && (
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  ✓ Available for express delivery by {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} to {pincode}.
                </p>
              )}
            </div>

            {/* Collapsible Accordions */}
            <div className="border-t border-zinc-200 divide-y divide-zinc-200 pt-2 text-xs">
              {/* Fabric & Craftsmanship */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'fabric' ? '' : 'fabric')}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-zinc-900 text-sm"
                >
                  <span>Fabric & Craftsmanship Details</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'fabric' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'fabric' && (
                  <div className="pt-3 space-y-2 text-zinc-600 leading-relaxed font-light">
                    <p>{product.fabric_details}</p>
                    <p>{product.description}</p>
                    <p className="font-semibold text-zinc-800">Care: {product.care_instructions}</p>
                  </div>
                )}
              </div>

              {/* Sizing & Fit Guide */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'sizing' ? '' : 'sizing')}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-zinc-900 text-sm"
                >
                  <span>Sizing & Tailoring Specifications</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'sizing' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'sizing' && (
                  <div className="pt-3 space-y-3 text-zinc-600">
                    <p className="text-xs">
                      Our silhouettes follow English tailoring standards. If you prefer a relaxed drape, consider sizing up.
                    </p>
                    <table className="w-full text-[11px] text-left border border-zinc-200">
                      <thead className="bg-zinc-100">
                        <tr>
                          <th className="p-2">Size</th>
                          <th className="p-2">Chest (Inches)</th>
                          <th className="p-2">Length (Inches)</th>
                          <th className="p-2">Shoulder (Inches)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        <tr><td className="p-2 font-bold">S</td><td className="p-2">38&quot;</td><td className="p-2">27.5&quot;</td><td className="p-2">16.5&quot;</td></tr>
                        <tr><td className="p-2 font-bold">M</td><td className="p-2">40&quot;</td><td className="p-2">28.5&quot;</td><td className="p-2">17.5&quot;</td></tr>
                        <tr><td className="p-2 font-bold">L</td><td className="p-2">42&quot;</td><td className="p-2">29.5&quot;</td><td className="p-2">18.5&quot;</td></tr>
                        <tr><td className="p-2 font-bold">XL</td><td className="p-2">44&quot;</td><td className="p-2">30.5&quot;</td><td className="p-2">19.5&quot;</td></tr>
                        <tr><td className="p-2 font-bold">XXL</td><td className="p-2">46&quot;</td><td className="p-2">31.5&quot;</td><td className="p-2">20.5&quot;</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-zinc-900 text-sm"
                >
                  <span>Shipping & Concierge Doorstep Returns</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pt-3 space-y-2 text-zinc-600 leading-relaxed font-light">
                    <p>• Complimentary express shipping on all orders over ₹1,499.</p>
                    <p>• Hand-inspected, branded bespoke box packaging with signature tissue wrap.</p>
                    <p>• Hassle-free 14-day doorstep exchange for size or alternative colourways.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patron Reviews Section */}
        <div className="mt-20 pt-12 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 font-medium">
                Client Impressions
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#0E0E0E] mt-1">
                Patron Reviews ({patronReviews.length})
              </h2>
            </div>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-6 py-3 rounded-full bg-[#0E0E0E] hover:bg-zinc-800 text-white text-[10px] uppercase tracking-[0.25em] font-medium flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {patronReviews.map((rev, idx) => (
              <div key={idx} className="p-6 bg-[#F6F5F3] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-wider font-semibold text-[#0E0E0E]">{rev.author}</p>
                    <p className="text-[10px] text-zinc-500 font-light">Verified Patron</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#0E0E0E]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#0E0E0E] text-[#0E0E0E]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-light italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
                <p className="text-[10px] text-zinc-400 text-right">{rev.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Submit Patron Review */}
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-serif text-lg font-normal text-[#0E0E0E]">
                  Patron Assessment
                </h3>
                <button onClick={() => setReviewModalOpen(false)} className="text-zinc-400 hover:text-black">
                  ✕
                </button>
              </div>

              <form onSubmit={handlePostReview} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-[0.2em] font-medium text-zinc-500 mb-1 text-[10px]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patronReviewAuthor}
                    onChange={(e) => setPatronReviewAuthor(e.target.value)}
                    placeholder="e.g. Lord Sterling"
                    className="w-full px-3 py-2 border border-zinc-300 bg-[#F6F5F3] focus:outline-none focus:border-[#0E0E0E]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-[0.2em] font-medium text-zinc-500 mb-1 text-[10px]">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPatronReviewRating(s)}
                        className="p-1"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= patronReviewRating
                              ? 'fill-[#0E0E0E] text-[#0E0E0E]'
                              : 'text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-[0.2em] font-medium text-zinc-500 mb-1 text-[10px]">
                    Fabric & Fit Impressions
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={patronReviewComment}
                    onChange={(e) => setPatronReviewComment(e.target.value)}
                    placeholder="Describe the hand-feel, collar resilience, drape, or fit..."
                    className="w-full px-3 py-2 border border-zinc-300 bg-[#F6F5F3] focus:outline-none focus:border-[#0E0E0E]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="flex-1 py-3 rounded-full border border-zinc-300 text-zinc-700 uppercase tracking-widest font-medium text-[10px] hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-[#0E0E0E] hover:bg-zinc-800 text-white uppercase tracking-widest font-medium text-[10px] shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-14 border-t border-zinc-200 space-y-10">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 font-medium">
                Recommendations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#0E0E0E]">
                Complementary Silhouettes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
