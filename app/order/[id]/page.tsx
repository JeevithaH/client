'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Package,
  Truck,
  PackageCheck,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Printer,
  MessageCircle,
  Star,
  Send,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/toast-context';
import { getWhatsAppOrderTrackingUrl } from '@/lib/whatsapp';

const STEPS: { status: OrderStatus; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: 'Placed', label: 'Order Placed', desc: 'Received & verified by atelier', icon: Clock },
  { status: 'Confirmed', label: 'Hand Tailored & Packed', desc: 'Bespoke boxing with wax seal', icon: Package },
  { status: 'Shipped', label: 'Dispatched in Transit', desc: 'Insured express road/air transit', icon: Truck },
  { status: 'Delivered', label: 'Delivered to Patron', desc: 'Doorstep concierge handover', icon: PackageCheck },
];

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const { success, error } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancingStatus, setAdvancingStatus] = useState(false);

  // Review states for Delivered orders
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to fetch order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setTimeout(() => {
      setReviewSubmitted(true);
      setSubmittingReview(false);
      success('Gratitude Recorded', `Thank you for granting us ${rating} stars! Your feedback elevates our craft.`);
    }, 600);
  };

  const handleAdvanceStatus = async () => {
    if (!order) return;
    const currentIndex = STEPS.findIndex((s) => s.status === order.status);
    if (currentIndex >= STEPS.length - 1) {
      success('Order Fulfilled', 'This order has already reached final delivery.');
      return;
    }

    const nextStep = STEPS[currentIndex + 1];
    setAdvancingStatus(true);

    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStep.status }),
      });
      const data = await res.json();
      if (data.success) {
        success('Status Advanced', `Order is now ${nextStep.status}.`);
        setOrder(data.order);
      } else {
        error('Update Failed', data.message);
      }
    } catch {
      error('Error', 'Could not advance status');
    } finally {
      setAdvancingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center font-serif text-lg text-zinc-700">
        Locating Order Portfolio...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <h2 className="font-serif text-2xl text-zinc-900">Order Not Located</h2>
        <p className="text-xs text-zinc-500 mt-1">Order identifier could not be verified in D1.</p>
        <Link
          href="/shop"
          className="mt-6 px-6 py-2.5 bg-[#0C1427] text-white text-xs uppercase tracking-widest"
        >
          Return to The Collection
        </Link>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Celebration Header */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0C1427] text-[#C5A880] rounded-full mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B6B38] font-bold block">
            Payment Verified & Confection Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-zinc-900 font-normal">
            Thank You, {order.customer_name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto font-light leading-relaxed">
            Your tailored order <strong className="font-mono font-semibold text-zinc-900">{order.order_number}</strong> has been secured in our atelier ledger.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-zinc-500">
            <span>Transaction: {order.razorpay_payment_id || 'RZP-PAID'}</span>
            <span>•</span>
            <span>Method: {order.payment_method}</span>
          </div>
        </div>

        {/* Live Delivery Status Stepper */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8B6B38] font-bold">
                Real-Time Tracking
              </span>
              <h2 className="font-serif text-xl font-medium text-zinc-900">
                Fulfillment Journey
              </h2>
            </div>

            {/* Status simulator test button */}
            <button
              onClick={handleAdvanceStatus}
              disabled={advancingStatus || currentStepIndex >= STEPS.length - 1}
              className="px-3 py-1.5 border border-zinc-400 hover:border-black text-zinc-800 text-xs uppercase tracking-wider font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B6B38]" />
              <span>Simulate Next Stage ({currentStepIndex + 1}/4)</span>
            </button>
          </div>

          {/* Stepper Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex flex-col items-center text-center space-y-2 relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-emerald-800 text-white'
                        : isCurrent
                        ? 'bg-[#0C1427] text-[#C5A880] ring-4 ring-[#C5A880]/30 scale-110'
                        : 'bg-zinc-100 text-zinc-400 border border-zinc-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <p
                    className={`font-serif text-xs font-semibold ${
                      isCurrent ? 'text-zinc-900' : isPast ? 'text-emerald-800' : 'text-zinc-400'
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="text-[11px] text-zinc-500 font-light leading-snug">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🌟 Delivered Order: Patron Star Review & Feedback Collector */}
        {order.status === 'Delivered' && (
          <div className="bg-white border-2 border-[#C5A880]/50 p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#8B6B38] font-bold">
                Order Handover Concluded
              </span>
              <h3 className="font-serif text-2xl text-zinc-900 font-normal">
                How Was Your Experience With This Garment?
              </h3>
              <p className="text-xs text-zinc-500 font-light">
                Your distinguished review assists our master tailors in upholding world-class luxury standards.
              </p>
            </div>

            {reviewSubmitted ? (
              <div className="p-6 bg-[#FAF8F5] border border-[#C5A880]/30 text-center space-y-2 max-w-md mx-auto">
                <div className="flex justify-center gap-1 text-[#C5A880]">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C5A880]" />
                  ))}
                </div>
                <h4 className="font-serif text-base text-zinc-900 font-medium">Review Successfully Archived</h4>
                <p className="text-xs text-zinc-600 font-light">
                  Thank you for conferring your {rating}-star impression upon Nirvigna Studio.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="max-w-md mx-auto space-y-4 pt-2">
                {/* Interactive Star Picker */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                        aria-label={`${star} Stars`}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'text-[#0E0E0E] fill-[#0E0E0E]'
                              : 'text-zinc-300 hover:text-zinc-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-zinc-700">
                    {rating === 5 && '★★★★★ Flawless Luxury (5/5)'}
                    {rating === 4 && '★★★★☆ High Caliber (4/5)'}
                    {rating === 3 && '★★★☆☆ Satisfactory (3/5)'}
                    {rating <= 2 && '★★☆☆☆ Needs Improvement'}
                  </span>
                </div>

                {/* Review Text */}
                <div>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts on the drape, fabric feel, or doorstep presentation (optional)..."
                    className="w-full p-3 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 bg-[#0E0E0E] hover:bg-zinc-800 text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Recording...' : 'Submit Patron Review'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Destination Address */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#8B6B38] font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" /> Destination
            </div>
            <p className="font-serif font-semibold text-sm text-zinc-900">{order.customer_name}</p>
            {typeof order.shipping_address === 'object' ? (
              <p className="text-zinc-600 leading-relaxed">
                {order.shipping_address.street}
                {order.shipping_address.apartment && `, ${order.shipping_address.apartment}`}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state} -{' '}
                {order.shipping_address.postal_code}
                <br />
                Phone: {order.shipping_address.phone}
              </p>
            ) : (
              <p className="text-zinc-600">{order.shipping_address}</p>
            )}
          </div>

          {/* Financial Ledger */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#8B6B38] font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Financial Summary
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Privilege Discount ({order.coupon_code})</span>
                <span>-₹{order.discount_amount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Insured Shipping</span>
              <span>
                {order.shipping_fee === 0 ? 'Complimentary' : `₹${order.shipping_fee}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-semibold text-zinc-900">
              <span>Gross Settled</span>
              <span className="font-serif">₹{order.total_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Itemized Garments */}
        <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
            Itemized Confections ({order.items?.length || 0} garments)
          </h3>
          <div className="divide-y divide-zinc-100">
            {order.items?.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-20 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                    <Image src={item.image_url} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-medium text-zinc-900">
                      {item.product_title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Colourway: {item.color_name} • Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif font-semibold text-sm text-zinc-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation & Utilities CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0C1427] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#1B2541] transition-all shadow-md"
          >
            <span>Continue Wardrobe Exploration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={getWhatsAppOrderTrackingUrl(order.order_number, order.customer_name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Tracking to WhatsApp</span>
          </a>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-zinc-300 hover:border-black text-zinc-800 text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#8B6B38]" />
            <span>Print Official Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
