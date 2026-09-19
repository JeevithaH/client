'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Sliders,
  ExternalLink,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { HeroSlide } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminHeroSlidesPage() {
  const { success, error } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('Shop Collection');
  const [buttonLink, setButtonLink] = useState('/collections/all');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hero-slides');
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides || []);
      } else {
        error('Error', data.message || 'Failed to fetch hero slides');
      }
    } catch {
      error('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreateModal = () => {
    setEditingSlide(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('');
    setImageUrl('');
    setButtonText('Shop Collection');
    setButtonLink('/collections/all');
    setTextAlignment('left');
    setDisplayOrder(slides.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle || '');
    setBadgeText(slide.badge_text || '');
    setImageUrl(slide.image_url);
    setButtonText(slide.button_text || 'Shop Collection');
    setButtonLink(slide.button_link || '/collections/all');
    setTextAlignment(slide.text_alignment || 'left');
    setDisplayOrder(slide.display_order);
    setIsActive(Boolean(slide.is_active));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      error('Validation', 'Title and Image URL are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<HeroSlide> = {
        id: editingSlide?.id,
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge_text: badgeText.trim(),
        image_url: imageUrl.trim(),
        button_text: buttonText.trim(),
        button_link: buttonLink.trim(),
        text_alignment: textAlignment,
        display_order: Number(displayOrder),
        is_active: isActive,
      };

      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success('Success', editingSlide ? 'Hero slide updated' : 'New hero slide published');
        setIsModalOpen(false);
        fetchSlides();
      } else {
        error('Error', data.message || 'Failed to save slide');
      }
    } catch {
      error('Error', 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;

    try {
      const res = await fetch(`/api/admin/hero-slides?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        success('Deleted', 'Hero slide deleted');
        fetchSlides();
      } else {
        error('Error', data.message || 'Failed to delete slide');
      }
    } catch {
      error('Error', 'Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            Storefront Experience
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-black font-sans mt-0.5">
            Hero Carousel Slides
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage the full-bleed hero banner slides displayed at the top of the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSlides}
            disabled={loading}
            className="p-2 border border-zinc-300 text-zinc-700 hover:text-black hover:border-black transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
          </button>
        </div>
      </div>

      {/* Slide Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-400 uppercase tracking-widest">
          Loading Slides...
        </div>
      ) : slides.length === 0 ? (
        <div className="py-16 text-center bg-white border border-zinc-200 p-8">
          <Sliders className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-black">No Hero Slides Active</p>
          <p className="text-xs text-zinc-500 mt-1 mb-4">
            Add a hero slide to welcome your visitors with high-impact visuals.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold"
          >
            Create First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className={`relative bg-white border ${
                s.is_active ? 'border-zinc-200' : 'border-dashed border-zinc-300 opacity-60'
              } shadow-sm overflow-hidden flex flex-col group`}
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/9] w-full bg-zinc-100 overflow-hidden">
                <Image
                  src={s.image_url}
                  alt={s.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Badge */}
                {s.badge_text && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-400 text-black text-[9px] uppercase font-bold tracking-wider">
                    {s.badge_text}
                  </span>
                )}

                {/* Status Indicator */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                      s.is_active ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Title Overlay Preview */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider line-clamp-1">{s.title}</p>
                  {s.subtitle && (
                    <p className="text-[10px] text-zinc-200 line-clamp-1 mt-0.5">{s.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Details & Controls */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-white text-xs space-y-3">
                <div className="space-y-1.5 text-zinc-600">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 uppercase tracking-wider">Order #{s.display_order}</span>
                    <span className="capitalize font-medium text-black">Align: {s.text_alignment}</span>
                  </div>
                  <div className="truncate text-zinc-500">
                    <span className="font-medium text-black">CTA:</span> {s.button_text} ({s.button_link})
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(s)}
                    className="flex items-center gap-1 text-xs font-semibold text-zinc-800 hover:text-black uppercase tracking-wider"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 uppercase tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-zinc-300 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h2 className="text-base font-bold uppercase tracking-wider text-black">
                {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Slide Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Arrival"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Premium Streetwear & Anime Collection 2026"
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    Badge Pill
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. HOT DROPS"
                    className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    Text Alignment
                  </label>
                  <select
                    value={textAlignment}
                    onChange={(e) => setTextAlignment(e.target.value as 'left' | 'center' | 'right')}
                    className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm bg-white"
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Center Aligned</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  High-Res Image URL *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (1920x1080 recommended)"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Shop Collection"
                    className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    placeholder="/collections/all"
                    className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                  />
                </div>
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
                      Active on Storefront
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  <span>{editingSlide ? 'Update Slide' : 'Publish Slide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
