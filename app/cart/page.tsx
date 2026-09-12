'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '@clerk/nextjs';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import { getWhatsAppCartOrderUrl } from '@/lib/whatsapp';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    isFreeShippingAlways,
    shippingSettings,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const router = useRouter();
  const { status } = useSession();
  const { isSignedIn: isClerkSignedIn } = useUser();
  const { success, error } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const isAuthenticated = isClerkSignedIn || status === 'authenticated';

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoadingCoupon(true);
    const res = await applyCoupon(couponCode.trim());
    setLoadingCoupon(false);

    if (res.success) {
      success('Privilege Applied', res.message);
      setCouponCode('');
    } else {
      error('Coupon Error', res.message);
    }
  };

  const progressPercent = isFreeShippingAlways
    ? 100
    : Math.min(
        100,
        Math.round(((subtotal - discountAmount) / (freeShippingThreshold || 1)) * 100)
      );

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-400 mb-6">
          <ShoppingBag className="w-10 h-10 text-[#0C1427]" />
        </div>
        <h1 className="font-serif text-3xl font-normal text-zinc-900">Your Shopping Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mt-2 font-light leading-relaxed">
          Select from our distinguished curations of Supima®, Giza 88 piqué, and heavyweight jerseys.
        </p>
        <Link
          href="/shop"
          className="mt-8 px-8 py-3.5 bg-[#0C1427] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#1B2541] transition-all shadow-md"
        >
          Explore The Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B6B38] font-bold">
              Personal Curation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-900 mt-1">
              Your Shopping Bag
            </h1>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {itemCount} garment{itemCount > 1 ? 's' : ''} in bag
          </span>
        </div>

        {/* Free Delivery Threshold Notification */}
        <div className="p-4 bg-white border border-zinc-200 mb-8 shadow-sm">
          {isFreeShippingAlways ? (
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Complimentary Express Delivery on all orders!
            </p>
          ) : amountNeededForFreeShipping > 0 ? (
            <p className="text-xs text-zinc-700 tracking-wide font-sans">
              Add{' '}
              <span className="font-bold text-zinc-900">
                ₹{amountNeededForFreeShipping.toLocaleString('en-IN')}
              </span>{' '}
              more to qualify for{' '}
              <span className="font-semibold text-[#8B6B38]">Complimentary Express Delivery</span>.
            </p>
          ) : (
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> You have unlocked Complimentary Express Delivery!
            </p>
          )}
          <div className="w-full bg-zinc-200 h-1.5 mt-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#C5A880] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-zinc-200 divide-y divide-zinc-200 shadow-sm">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="relative w-24 h-32 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-serif text-base font-medium text-zinc-900 hover:text-black transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                          <span>Colour: {item.colorName}</span>
                          <span>•</span>
                          <span className="font-semibold text-zinc-800">Size: {item.size}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                          aria-label="Reduce quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-zinc-900 min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right">
                        <span className="font-serif text-base font-semibold text-zinc-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] text-zinc-400">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">
              <Link href="/shop" className="hover:text-black uppercase tracking-wider luxury-link text-zinc-600 transition-colors">
                ← Continue Browsing Collection
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="space-y-6">
            {/* Coupon Box */}
            <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
                Privilege Code
              </h3>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold font-mono">{appliedCoupon.code}</p>
                      <p className="text-[11px] text-emerald-700">
                        {appliedCoupon.discount_type === 'percent'
                          ? `${appliedCoupon.discount_percent}% Off Applied`
                          : `₹${appliedCoupon.discount_amount} Flat Savings`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 uppercase transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SHIP10 or LUXE500"
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                    <button
                      type="submit"
                      disabled={loadingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-zinc-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {loadingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Try <strong>SHIP10</strong> for 10% savings or <strong>LUXE500</strong> for orders &gt; ₹2,499
                  </p>
                </form>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilege Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Insured Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase text-[10px]">
                        Complimentary
                      </span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-zinc-300 text-base font-semibold text-zinc-900">
                  <span className="font-serif">Grand Total</span>
                  <span className="font-serif text-xl">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-zinc-400 text-right">Includes all duties and GST (12%)</p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-luxury cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Order via WhatsApp CTA */}
              <a
                href={getWhatsAppCartOrderUrl({
                  items,
                  subtotal,
                  discountAmount,
                  total,
                  couponCode: appliedCoupon?.code,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Complete Bag via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
