'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '@clerk/nextjs';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';

export function CartDrawer() {
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
    shippingSettings,
    isFreeShippingAlways,
    isCartOpen,
    setIsCartOpen,
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
  const [couponLoading, setCouponLoading] = useState(false);

  const isAuthenticated = isClerkSignedIn || status === 'authenticated';

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(false);
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    const res = await applyCoupon(couponCode.trim());
    setCouponLoading(false);

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C1427]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0C1427]" />
              <h2 className="font-serif text-lg font-medium text-zinc-900 tracking-wide">
                Shopping Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-zinc-50 border-b border-zinc-200/80">
            {isFreeShippingAlways ? (
              <p className="text-xs font-medium text-emerald-800 flex items-center gap-1.5 tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Complimentary Express Delivery on all orders!
              </p>
            ) : amountNeededForFreeShipping > 0 ? (
              <p className="text-xs text-zinc-700 tracking-wide font-sans">
                Add <span className="font-semibold text-zinc-900">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</span> more to qualify for <span className="font-semibold text-[#8B6B38]">Complimentary Express Delivery</span>
              </p>
            ) : (
              <p className="text-xs font-medium text-emerald-800 flex items-center gap-1.5 tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> You have unlocked Complimentary Express Delivery!
              </p>
            )}
            <div className="w-full bg-zinc-200 h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C5A880] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-medium text-zinc-900">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Experience the peerless touch of Supima and Egyptian Giza cotton.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#0C1427] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1B2541] transition-all"
                >
                  Explore The Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="relative w-20 h-24 bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200/60">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-medium text-zinc-900 hover:text-black transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                        <span>Color: {item.colorName}</span>
                        <span>•</span>
                        <span className="font-medium text-zinc-700">Size: {item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-zinc-300">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-zinc-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-zinc-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Coupon & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-[#FAF8F5] space-y-4">
              {/* Coupon input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-700 hover:text-rose-900 transition-colors uppercase font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon (e.g. SHIP10)"
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase tracking-wider bg-white border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-zinc-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Privilege Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Express Delivery</span>
                  <span className="text-emerald-700 font-semibold uppercase text-xs tracking-wider">
                    FREE DELIVERY
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-300 text-sm font-semibold text-zinc-900">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-zinc-400 text-right">Inclusive of all duties and GST</p>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 text-center border border-zinc-900 text-zinc-900 text-xs uppercase tracking-[0.15em] font-medium hover:bg-zinc-100 transition-colors"
                >
                  View Bag
                </Link>
                <button
                  onClick={handleCheckout}
                  className="py-3 px-4 text-center bg-[#0C1427] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.15em] font-semibold hover:bg-[#1B2541] transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
