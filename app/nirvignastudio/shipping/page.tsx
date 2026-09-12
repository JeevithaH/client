'use client';

import React, { useEffect, useState } from 'react';
import {
  Truck,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Percent,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/context/toast-context';

interface ShippingSettingsData {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  standardShippingFee: number;
  shippingNotice: string;
  freeShippingAllOrders?: boolean;
}

export default function AdminShippingPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [shippingMode, setShippingMode] = useState<'always_free' | 'threshold' | 'flat_rate'>('threshold');
  const [standardFee, setStandardFee] = useState<number>(150);
  const [threshold, setThreshold] = useState<number>(999);
  const [notice, setNotice] = useState<string>('Complimentary express shipping on all orders over ₹999.');

  // Fetch current settings from backend
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/shipping-settings');
      const data = await res.json();
      if (data?.success && data?.settings) {
        const s: ShippingSettingsData = data.settings;
        setStandardFee(s.standardShippingFee ?? 150);
        setThreshold(s.freeShippingThreshold ?? 999);
        setNotice(s.shippingNotice || 'Complimentary express shipping on all orders over ₹999.');

        if (!s.freeShippingEnabled) {
          setShippingMode('flat_rate');
        } else if (s.freeShippingAllOrders || s.freeShippingThreshold <= 0) {
          setShippingMode('always_free');
        } else {
          setShippingMode('threshold');
        }
      }
    } catch (err) {
      console.error('Failed to load shipping settings:', err);
      error('Failed to Load', 'Could not retrieve shipping policy from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const isFreeEnabled = shippingMode !== 'flat_rate';
    const isAlwaysFree = shippingMode === 'always_free';
    const finalThreshold = isAlwaysFree ? 0 : threshold;

    try {
      const res = await fetch('/api/shipping-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeShippingEnabled: isFreeEnabled,
          freeShippingAllOrders: isAlwaysFree,
          freeShippingThreshold: finalThreshold,
          standardShippingFee: standardFee,
          shippingNotice: notice,
        }),
      });

      const data = await res.json();
      if (data?.success) {
        success('Shipping Policy Updated', 'Changes are now live across Checkout, Cart, and Order Verification.');
      } else {
        error('Update Failed', data?.message || 'Could not save shipping policy.');
      }
    } catch {
      error('Network Error', 'Failed to connect to server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 bg-[#0C1427] text-[#C5A880] rounded">
              <Truck className="w-5 h-5" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8B6B38] font-bold">
              Logistics & Fulfillment
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-zinc-900 font-normal">
            Shipping Fees & Delivery Policy
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure free shipping thresholds, standard parcel rates, and live customer checkout notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={loading}
            className="px-4 py-2.5 border border-zinc-300 text-zinc-700 text-xs uppercase tracking-wider font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#0C1427] text-white hover:bg-[#1B2541] text-xs uppercase tracking-widest font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5 text-[#C5A880]" />
            {saving ? 'Saving...' : 'Save Policy'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Policy Strategy Selection */}
          <div className="bg-white border border-zinc-200 p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-medium text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8B6B38]" />
              Shipping Fee Strategy
            </h2>
            <p className="text-xs text-zinc-500">
              Select how shipping charges should be calculated for patron orders.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Option 1: Free Shipping on All Orders */}
              <div
                onClick={() => {
                  setShippingMode('always_free');
                  setNotice('Complimentary express shipping on all orders nationwide.');
                }}
                className={`cursor-pointer p-4 border rounded transition-all text-left ${
                  shippingMode === 'always_free'
                    ? 'border-[#0C1427] bg-[#FAF8F5] ring-1 ring-[#0C1427]'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 100% Free
                  </span>
                  {shippingMode === 'always_free' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0C1427]" />
                  )}
                </div>
                <h3 className="font-medium text-sm text-zinc-900">Free on All Orders</h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  No shipping fees applied to any cart, regardless of order value.
                </p>
              </div>

              {/* Option 2: Free Shipping Above Threshold */}
              <div
                onClick={() => {
                  setShippingMode('threshold');
                  setNotice(`Complimentary express shipping on all orders over ₹${threshold}.`);
                }}
                className={`cursor-pointer p-4 border rounded transition-all text-left ${
                  shippingMode === 'threshold'
                    ? 'border-[#0C1427] bg-[#FAF8F5] ring-1 ring-[#0C1427]'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#8B6B38] uppercase tracking-wider flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> Threshold
                  </span>
                  {shippingMode === 'threshold' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0C1427]" />
                  )}
                </div>
                <h3 className="font-medium text-sm text-zinc-900">Free Above Minimum</h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  Free delivery when cart reaches minimum spend; standard fee otherwise.
                </p>
              </div>

              {/* Option 3: Flat Rate Shipping */}
              <div
                onClick={() => {
                  setShippingMode('flat_rate');
                  setNotice(`Standard insured express delivery available nationwide for ₹${standardFee}.`);
                }}
                className={`cursor-pointer p-4 border rounded transition-all text-left ${
                  shippingMode === 'flat_rate'
                    ? 'border-[#0C1427] bg-[#FAF8F5] ring-1 ring-[#0C1427]'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                    Flat Rate
                  </span>
                  {shippingMode === 'flat_rate' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0C1427]" />
                  )}
                </div>
                <h3 className="font-medium text-sm text-zinc-900">Fixed Shipping Fee</h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  Fixed standard fee applied on every order with no free shipping threshold.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Pricing Fields */}
          <div className="bg-white border border-zinc-200 p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-medium text-zinc-900">
              Fee Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Standard Fee Field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Standard Shipping Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={standardFee}
                    onChange={(e) => setStandardFee(Math.max(0, Number(e.target.value)))}
                    disabled={shippingMode === 'always_free'}
                    className={`w-full pl-8 pr-4 py-2.5 border text-sm transition-colors rounded ${
                      shippingMode === 'always_free'
                        ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                        : 'bg-white text-zinc-900 border-zinc-300 focus:border-[#0C1427] focus:outline-none'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {shippingMode === 'always_free'
                    ? 'Disabled because Free Shipping is active for all orders.'
                    : 'Amount charged when cart does not qualify for free shipping.'}
                </p>
              </div>

              {/* Minimum Threshold Field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Free Shipping Threshold (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={threshold}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setThreshold(val);
                      if (shippingMode === 'threshold') {
                        setNotice(`Complimentary express shipping on all orders over ₹${val}.`);
                      }
                    }}
                    disabled={shippingMode !== 'threshold'}
                    className={`w-full pl-8 pr-4 py-2.5 border text-sm transition-colors rounded ${
                      shippingMode !== 'threshold'
                        ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                        : 'bg-white text-zinc-900 border-zinc-300 focus:border-[#0C1427] focus:outline-none'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {shippingMode === 'threshold'
                    ? 'Carts reaching this subtotal automatically receive ₹0 shipping fee.'
                    : 'Only applicable in Free Above Minimum mode.'}
                </p>
              </div>
            </div>

            {/* Announcement / Notice */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Customer Delivery Announcement
              </label>
              <input
                type="text"
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                placeholder="e.g. Complimentary express shipping on all orders over ₹999."
                className="w-full px-4 py-2.5 border border-zinc-300 rounded text-sm text-zinc-900 focus:border-[#0C1427] focus:outline-none"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Shown in the cart drawer, checkout breakdown, and product detail accordion.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Customer Preview */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 p-6 shadow-sm sticky top-6">
            <h2 className="font-serif text-lg font-medium text-zinc-900 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Live Patron Preview
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              How patrons will see this policy reflected during checkout.
            </p>

            <div className="bg-[#FAF8F5] border border-zinc-200 p-4 rounded space-y-4">
              <div className="text-[10px] uppercase tracking-widest text-[#8B6B38] font-bold">
                Cart Summary Preview
              </div>

              <div className="divide-y divide-zinc-200/80 text-xs space-y-2 pt-1">
                <div className="flex justify-between text-zinc-600 pt-2">
                  <span>Sample Subtotal (1 Luxury Garment)</span>
                  <span className="font-medium text-zinc-900">₹1,999</span>
                </div>
                <div className="flex justify-between items-center text-zinc-600 pt-2">
                  <span>Express Insured Shipping</span>
                  {shippingMode === 'always_free' || 1999 >= threshold ? (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      FREE / Complimentary
                    </span>
                  ) : (
                    <span className="font-medium text-zinc-900">₹{standardFee}</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-zinc-900 pt-3">
                  <span>Total Due</span>
                  <span>
                    ₹
                    {(
                      1999 +
                      (shippingMode === 'always_free' || 1999 >= threshold ? 0 : standardFee)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Notification Banner Preview */}
              <div className="mt-4 p-3 bg-white border border-zinc-200 text-xs rounded">
                <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Patron Banner:
                </div>
                <div className="text-zinc-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {notice}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
              <span>Database Sync: Cloudflare D1</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
