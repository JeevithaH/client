'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Layers,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Placement, PlacementSlot } from '@/lib/types';
import { useToast } from '@/context/toast-context';

const SLOTS: { id: PlacementSlot; label: string; description: string; previewHint: string }[] = [
  {
    id: 'hero_banner',
    label: 'Hero Main Stage',
    description: 'Prime full-viewport editorial banner welcoming patrons on the homepage.',
    previewHint: 'Recommended: 1920x1080 high-contrast fashion editorial photo.',
  },
  {
    id: 'home_ad_campaign',
    label: 'Editorial Campaign Ad',
    description: 'Mid-page signature campaign spread showcasing collection craftsmanship.',
    previewHint: 'Recommended: 1920x800 cinematic landscape image.',
  },
  {
    id: 'home_ad_strip',
    label: 'Privilege Promo Strip',
    description: 'Slim editorial strip highlighting special invitations and couture releases.',
    previewHint: 'Recommended: 1600x450 textured or atmospheric banner.',
  },
  {
    id: 'shop_banner',
    label: 'Atelier Boutique Banner',
    description: 'Header spread displayed atop the complete product catalogue and search archive.',
    previewHint: 'Recommended: 1920x600 minimalist background banner.',
  },
  {
    id: 'savoir_faire',
    label: 'Savoir-Faire Heritage Showcase',
    description: 'Artisanal craftsmanship showcase feature placed across brand highlights.',
    previewHint: 'Recommended: 1600x900 detailed macro texture shot.',
  },
];

const PRESET_IMAGES = [
  {
    name: 'Atelier Runway Dark',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Minimalist Editorial',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Couture Silhouette',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Midnight Silk',
    url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Tailored Suiting',
    url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function AdminPlacementsPage() {
  const { success, error } = useToast();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [slotKey, setSlotKey] = useState<PlacementSlot>('home_ad_campaign');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/placements');
      const data = await res.json();
      if (data.success) {
        setPlacements(data.placements || []);
      }
    } catch (err) {
      console.error('Failed to load placements', err);
      error('Failed to load ad placements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const openNewModal = (preselectedSlot?: PlacementSlot) => {
    setEditingId(null);
    setSlotKey(preselectedSlot || 'home_ad_campaign');
    setTitle('');
    setSubtitle('');
    setBadgeText('AUTUMN / WINTER 2026');
    setImageUrl(PRESET_IMAGES[0].url);
    setLinkUrl('/shop');
    setCtaText('Discover The Campaign');
    setIsActive(true);
    setDisplayOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (placement: Placement) => {
    setEditingId(placement.id);
    setSlotKey(placement.slot_key);
    setTitle(placement.title || '');
    setSubtitle(placement.subtitle || '');
    setBadgeText(placement.badge_text || '');
    setImageUrl(placement.image_url || '');
    setLinkUrl(placement.link_url || '/shop');
    setCtaText(placement.cta_text || 'Explore Collection');
    setIsActive(Boolean(placement.is_active));
    setDisplayOrder(placement.display_order || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      error('Please provide an image URL for this placement');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        id: editingId || undefined,
        slot_key: slotKey,
        title,
        subtitle,
        badge_text: badgeText,
        image_url: imageUrl.trim(),
        link_url: linkUrl,
        cta_text: ctaText,
        is_active: isActive,
        display_order: Number(displayOrder),
      };

      const res = await fetch('/api/admin/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success(editingId ? 'Placement banner updated' : 'New placement created successfully');
        setIsModalOpen(false);
        fetchPlacements();
      } else {
        error(data.message || 'Failed to save placement');
      }
    } catch (err) {
      console.error(err);
      error('Network error saving placement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/placements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPlacements((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
        );
        success(`Placement banner ${!currentStatus ? 'activated' : 'deactivated'}`);
      } else {
        error(data.message || 'Failed to toggle status');
      }
    } catch (err) {
      console.error(err);
      error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this banner placement?')) return;
    try {
      const res = await fetch(`/api/admin/placements/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPlacements((prev) => prev.filter((p) => p.id !== id));
        success('Placement removed');
      } else {
        error(data.message || 'Failed to delete placement');
      }
    } catch (err) {
      console.error(err);
      error('Failed to remove placement');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-white bg-black px-2.5 py-0.5">
              Storefront Studio
            </span>
            <span className="text-xs text-zinc-500 font-medium">Visual Merchandising</span>
          </div>
          <h1 className="font-sans text-3xl font-bold tracking-tight text-black">
            Ad &amp; Banner Placements
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Control the visual narrative. Insert campaign hero visual arts, midway editorial spreads, and promotional strips anywhere across the storefront.
          </p>
        </div>

        <button
          onClick={() => openNewModal()}
          className="flex items-center gap-2 px-5 py-3 bg-black text-white hover:bg-zinc-800 text-xs uppercase font-bold tracking-[0.15em] transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Ad Placement</span>
        </button>
      </div>

      {/* Slots Overview Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SLOTS.map((slot) => {
          const count = placements.filter((p) => p.slot_key === slot.id).length;
          const activeCount = placements.filter((p) => p.slot_key === slot.id && p.is_active).length;
          return (
            <div
              key={slot.id}
              className="bg-white border border-zinc-200 p-4 relative group hover:border-black transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                  {slot.id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-100 text-zinc-700">
                  {activeCount} active / {count} total
                </span>
              </div>
              <h3 className="font-sans text-base text-black font-bold">{slot.label}</h3>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                {slot.description}
              </p>
              <button
                onClick={() => openNewModal(slot.id)}
                className="mt-3 text-[10px] uppercase tracking-widest text-black hover:text-zinc-600 transition-colors font-bold flex items-center gap-1 luxury-link"
              >
                <span>+ Add to this slot</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Placements Listing */}
      <div className="bg-white border border-zinc-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-black" />
            <h2 className="font-sans text-base font-bold uppercase tracking-wider text-black">Configured Placements ({placements.length})</h2>
          </div>
          <button
            onClick={fetchPlacements}
            className="text-xs text-zinc-500 hover:text-black flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-400 font-mono">
            Scanning placements archive...
          </div>
        ) : placements.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <ImageIcon className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="font-medium text-lg text-zinc-700">No placements configured yet</p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Initialize a new campaign ad banner to display editorial photography on your store.
            </p>
            <button
              onClick={() => openNewModal()}
              className="px-4 py-2 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors"
            >
              Create First Placement
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {placements.map((placement) => {
              const slotInfo = SLOTS.find((s) => s.id === placement.slot_key);
              return (
                <div
                  key={placement.id}
                  className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-zinc-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-56 h-32 bg-zinc-900 shrink-0 overflow-hidden border border-zinc-200 group">
                    <img
                      src={placement.image_url}
                      alt={placement.title || 'Ad banner'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] uppercase px-1.5 py-0.5 tracking-wider font-mono">
                      {placement.slot_key}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                        {slotInfo?.label || placement.slot_key}
                      </span>
                      {placement.badge_text && (
                        <span className="text-[9px] uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 font-medium">
                          {placement.badge_text}
                        </span>
                      )}
                    </div>

                    <h3 className="font-sans text-lg text-black font-bold truncate">
                      {placement.title || 'Untitled Banner'}
                    </h3>

                    {placement.subtitle && (
                      <p className="text-xs text-zinc-500 line-clamp-1 max-w-xl">
                        {placement.subtitle}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                      <span>Destination: <code className="text-black bg-zinc-100 px-1 py-0.5">{placement.link_url}</code></span>
                      <span>CTA: <strong className="text-black">{placement.cta_text || 'None'}</strong></span>
                      <span>Order: <strong className="text-black">{placement.display_order}</strong></span>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                    <button
                      onClick={() => handleToggle(placement.id, Boolean(placement.is_active))}
                      className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold border flex items-center gap-1.5 transition-colors ${
                        placement.is_active
                          ? 'bg-black text-white border-black hover:bg-zinc-800'
                          : 'bg-zinc-100 text-zinc-500 border-zinc-300 hover:bg-zinc-200'
                      }`}
                    >
                      {placement.is_active ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Active
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" /> Inactive
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => openEditModal(placement)}
                      className="p-2 border border-zinc-200 text-zinc-600 hover:text-black hover:border-black transition-colors"
                      title="Edit Placement"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(placement.id)}
                      className="p-2 border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
                      title="Delete Placement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Studio Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-zinc-300 w-full max-w-2xl my-8 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-200 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-500">
                {editingId ? 'Modify Visual Asset' : 'New Visual Placement'}
              </span>
              <h2 className="font-sans text-2xl font-bold text-black">
                {editingId ? 'Edit Ad Placement' : 'Deploy Ad Banner Placement'}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Slot Target */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700 mb-1">
                  Target Website Slot *
                </label>
                <select
                  value={slotKey}
                  onChange={(e) => setSlotKey(e.target.value as PlacementSlot)}
                  className="w-full border border-zinc-300 p-2.5 text-xs text-black bg-white focus:outline-none focus:border-black"
                  required
                >
                  {SLOTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.id})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {SLOTS.find((s) => s.id === slotKey)?.description}
                </p>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700 mb-1">
                  High-Resolution Image URL *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full border border-zinc-300 p-2.5 text-xs text-black focus:outline-none focus:border-black font-mono"
                  required
                />
                
                {/* Quick Presets */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">Curated Presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => setImageUrl(preset.url)}
                      className="text-[10px] px-2 py-0.5 border border-zinc-200 hover:border-black hover:text-black text-zinc-600 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Live Preview */}
                {imageUrl && (
                  <div className="mt-3 relative h-36 w-full bg-zinc-900 border border-zinc-200 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <p className="text-white text-xs font-medium truncate">
                        {title || 'Live Image Preview'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700 mb-1">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Signature Cotton Essentials"
                    className="w-full border border-zinc-300 p-2.5 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700 mb-1">
                    Badge / Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. EXCLUSIVE ATELIER RELEASE"
                    className="w-full border border-zinc-300 p-2.5 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700 mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={2}
                  placeholder="e.g. Handcrafted with bespoke Peruvian Pima cotton."
                  className="w-full border border-zinc-300 p-2.5 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              {/* Link URL & CTA Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700 mb-1">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="/shop or /shop?category=monogram"
                    className="w-full border border-zinc-300 p-2.5 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Explore Collection"
                    className="w-full border border-zinc-300 p-2.5 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Display Order & Active status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-200">
                <div className="flex items-center gap-3">
                  <label className="text-xs uppercase font-bold tracking-wider text-zinc-700">
                    Order Priority:
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    min={0}
                    className="w-20 border border-zinc-300 p-1.5 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-black border-zinc-300 rounded focus:ring-0"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Publish Immediately (Active)
                  </span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-zinc-300 text-zinc-600 text-xs uppercase tracking-wider font-semibold hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-bold hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {submitting ? 'Committing...' : editingId ? 'Update Banner' : 'Publish Placement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
