'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Edit2,
  Check,
  X,
  Truck,
  Headphones,
  RotateCcw,
  CreditCard,
  Lock,
  Award
} from 'lucide-react';
import { TrustPillar } from '@/lib/types';
import { useToast } from '@/context/toast-context';

const ICON_PRESETS = [
  { key: 'truck', label: 'Truck (Shipping)', icon: Truck },
  { key: 'headphones', label: 'Headphones (Support)', icon: Headphones },
  { key: 'rotate-ccw', label: 'Rotate Arrow (Returns)', icon: RotateCcw },
  { key: 'credit-card', label: 'Card (Payment)', icon: CreditCard },
  { key: 'shield-check', label: 'Shield (Security)', icon: ShieldCheck },
  { key: 'award', label: 'Award (Quality)', icon: Award },
];

export default function AdminTrustPillarsPage() {
  const { success, error } = useToast();
  const [pillars, setPillars] = useState<TrustPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPillar, setEditingPillar] = useState<TrustPillar | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [icon, setIcon] = useState('truck');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPillars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/trust-pillars');
      const data = await res.json();
      if (data.success) {
        setPillars(data.pillars || []);
      } else {
        error('Error', data.message || 'Failed to fetch trust pillars');
      }
    } catch {
      error('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPillars();
  }, []);

  const openEditModal = (p: TrustPillar) => {
    setEditingPillar(p);
    setTitle(p.title || '');
    setSubtitle(p.subtitle || p.description || '');
    setIcon(p.icon || p.icon_name || 'truck');
    setDisplayOrder(p.display_order);
    setIsActive(Boolean(p.is_active));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPillar || !title.trim() || !subtitle.trim()) {
      error('Validation', 'Title and subtitle are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<TrustPillar> = {
        id: editingPillar.id,
        title: title.trim(),
        subtitle: subtitle.trim(),
        icon: icon,
        display_order: Number(displayOrder),
        is_active: isActive,
      };

      const res = await fetch('/api/admin/trust-pillars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success('Success', 'Trust pillar updated');
        setEditingPillar(null);
        fetchPillars();
      } else {
        error('Error', data.message || 'Failed to save');
      }
    } catch {
      error('Error', 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'truck': return <Truck className="w-6 h-6 text-black stroke-[1.5]" />;
      case 'headphones': return <Headphones className="w-6 h-6 text-black stroke-[1.5]" />;
      case 'rotate-ccw': return <RotateCcw className="w-6 h-6 text-black stroke-[1.5]" />;
      case 'credit-card': return <CreditCard className="w-6 h-6 text-black stroke-[1.5]" />;
      case 'award': return <Award className="w-6 h-6 text-black stroke-[1.5]" />;
      default: return <ShieldCheck className="w-6 h-6 text-black stroke-[1.5]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            Trust & Guarantees
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-black font-sans mt-0.5">
            Store Trust Pillars
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage the 4 core guarantees displayed below the product collections (Free Shipping, Support, Returns, Payments).
          </p>
        </div>

        <button
          onClick={fetchPillars}
          disabled={loading}
          className="p-2 border border-zinc-300 text-zinc-700 hover:text-black hover:border-black transition-colors self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Pillars Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-400 uppercase tracking-widest">
          Loading Trust Pillars...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div
              key={p.id}
              className={`p-6 bg-white border ${
                p.is_active ? 'border-zinc-200' : 'border-dashed border-zinc-300 opacity-60'
              } shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                  {renderIcon(p.icon)}
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                    {p.title}
                  </h3>
                  <span
                    className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold ${
                      p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {p.is_active ? 'Active' : 'Off'}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">{p.subtitle}</p>
              </div>

              <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-[10px] text-zinc-400 font-mono">Pos #{p.display_order}</span>
                <button
                  onClick={() => openEditModal(p)}
                  className="flex items-center gap-1 font-semibold text-black uppercase tracking-wider hover:underline"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPillar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-zinc-300 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h2 className="text-base font-bold uppercase tracking-wider text-black">
                Edit Guarantee Pillar
              </h2>
              <button
                onClick={() => setEditingPillar(null)}
                className="p-1 text-zinc-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Pillar Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Free Shipping"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Subtitle / Condition *
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Free shipping on orders over ₹499"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Icon
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm bg-white"
                >
                  {ICON_PRESETS.map((ic) => (
                    <option key={ic.key} value={ic.key}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    min={1}
                    max={4}
                    className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-black border-zinc-300 rounded-none focus:ring-black"
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-black">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPillar(null)}
                  className="px-4 py-2 border border-zinc-300 text-black hover:bg-zinc-100 uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-black text-white hover:bg-zinc-800 uppercase tracking-wider font-semibold flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
