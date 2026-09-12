'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Tag, Trash2, Calendar, ShieldCheck, X, Check, Clock } from 'lucide-react';
import { Coupon, DiscountType } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminCouponsPage() {
  const { success, error } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percent');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(999);
  const [usageLimit, setUsageLimit] = useState<number | ''>(100);
  const [perUserLimit, setPerUserLimit] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState<string>('2026-12-31');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setSubmitting(true);
    try {
      const payload = {
        code: code.toUpperCase().trim(),
        discount_type: discountType,
        discount_percent: discountType === 'percent' ? Number(discountValue) : 0,
        discount_amount: discountType === 'fixed' ? Number(discountValue) : 0,
        min_order_value: Number(minOrderValue),
        usage_limit: usageLimit ? Number(usageLimit) : null,
        per_user_limit: Number(perUserLimit),
        expires_at: expiresAt ? `${expiresAt}T23:59:59Z` : null,
        description,
        active: true,
      };

      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success('Privilege Voucher Created', `Code ${code.toUpperCase()} is active.`);
        setIsModalOpen(false);
        resetForm();
        fetchCoupons();
      } else {
        error('Creation Failed', data.message);
      }
    } catch {
      error('Error', 'Failed to save coupon to Cloudflare D1');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Decommission coupon '${code}'?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success('Coupon Removed', `${code} has been retired.`);
        fetchCoupons();
      } else {
        error('Error', data.message);
      }
    } catch {
      error('Error', 'Could not delete coupon');
    }
  };

  const resetForm = () => {
    setCode('');
    setDiscountType('percent');
    setDiscountValue(10);
    setMinOrderValue(999);
    setUsageLimit(100);
    setPerUserLimit(1);
    setExpiresAt('2026-12-31');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Promotions & Discounts
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
            Privilege Coupons & Vouchers
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Issue New Coupon
        </button>
      </div>

      {/* Coupons List Table */}
      <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Code & Type</th>
                <th className="py-3.5 px-6 font-bold">Benefit</th>
                <th className="py-3.5 px-6 font-bold">Min Spend</th>
                <th className="py-3.5 px-6 font-bold">Redemption Counter</th>
                <th className="py-3.5 px-6 font-bold">Per-Patron Limit</th>
                <th className="py-3.5 px-6 font-bold">Expiration</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    Loading privilege codes...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <Tag className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-medium text-base text-zinc-700">No coupons currently issued</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Click Issue New Coupon to create your first voucher.</p>
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const usagePercent = c.usage_limit
                    ? Math.min(100, Math.round((c.times_used / c.usage_limit) * 100))
                    : null;
                  const isExpired = c.expires_at && new Date(c.expires_at).getTime() < Date.now();

                  return (
                    <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold tracking-wider px-2 py-0.5 bg-zinc-100 border border-zinc-300 text-black">
                            {c.code}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-zinc-600">
                            {c.discount_type === 'percent' ? 'Percentage' : 'Flat Cash'}
                          </span>
                        </div>
                        {c.description && (
                          <p className="text-[11px] text-zinc-500 mt-1 max-w-xs truncate">
                            {c.description}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-sm text-black">
                          {c.discount_type === 'percent'
                            ? `${c.discount_percent}% OFF`
                            : `₹${c.discount_amount.toLocaleString('en-IN')} OFF`}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-zinc-700 font-medium">
                        ₹{c.min_order_value.toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-medium text-black">
                            <span>{c.times_used} used</span>
                            <span className="text-zinc-400">/</span>
                            <span>{c.usage_limit ? `${c.usage_limit} total` : '∞ unlimited'}</span>
                          </div>
                          {usagePercent !== null && (
                            <div className="w-24 bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  usagePercent >= 90 ? 'bg-black' : 'bg-zinc-600'
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] font-mono">
                          {c.per_user_limit} redemption{c.per_user_limit > 1 ? 's' : ''} max
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {c.expires_at ? (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] ${
                              isExpired ? 'text-rose-600 font-semibold' : 'text-zinc-600'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(c.expires_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {isExpired && ' (Expired)'}
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">No Expiration</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-black" />
                <h3 className="font-sans text-base font-bold uppercase tracking-wider text-black">Issue Privilege Coupon</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LUXE25, AUTUMN10"
                  className="w-full px-3 py-2 text-sm font-mono uppercase bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Discount Model
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Currency (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    {discountType === 'percent' ? 'Discount % *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={discountType === 'percent' ? 100 : 10000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Min Order Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Overall Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 100 (blank for infinite)"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Per-User Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={perUserLimit}
                    onChange={(e) => setPerUserLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Description / Patron Terms
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 15% inaugural discount for esteemed patrons"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs uppercase tracking-widest font-medium hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> {submitting ? 'Creating...' : 'Issue Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
