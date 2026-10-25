'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  MoveUp,
  MoveDown,
  Shirt,
  Sparkles,
  Eye,
  Layers,
  Palette
} from 'lucide-react';
import { RackGarmentItem } from '@/lib/types';
import { useToast } from '@/context/toast-context';

const PRESET_STYLES = [
  {
    name: 'Charcoal Noir (Boxy Tee)',
    folder: 'hoodie',
    colorHex: '#18181B',
    colorName: 'Charcoal Noir',
    profileUrl: '/fixtures/rack/hoodie/profile.webp',
    frontUrl: '/fixtures/rack/hoodie/front.webp',
    atlasUrl: '/fixtures/rack/hoodie/atlas.webp',
    backUrl: '/fixtures/rack/hoodie/back.webp',
  },
  {
    name: 'Chalk White (Supima Tee)',
    folder: 'lake-white-v3',
    colorHex: '#FAFAFA',
    colorName: 'Chalk White',
    profileUrl: '/fixtures/rack/lake-white-v3/profile.webp',
    frontUrl: '/fixtures/rack/lake-white-v3/front.webp',
    atlasUrl: '/fixtures/rack/lake-white-v3/atlas.webp',
    backUrl: '/fixtures/rack/lake-white-v3/back.webp',
  },
  {
    name: 'Imperial Navy (Compact Crew)',
    folder: 'crew',
    colorHex: '#16233B',
    colorName: 'Imperial Navy',
    profileUrl: '/fixtures/rack/crew/profile.webp',
    frontUrl: '/fixtures/rack/crew/front.webp',
    atlasUrl: '/fixtures/rack/crew/atlas.webp',
    backUrl: '/fixtures/rack/crew/back.webp',
  },
  {
    name: 'Verona Rose (Washed Tee)',
    folder: 'cards-pink-v3',
    colorHex: '#E2B8B8',
    colorName: 'Dusty Rose',
    profileUrl: '/fixtures/rack/cards-pink-v3/profile.webp',
    frontUrl: '/fixtures/rack/cards-pink-v3/front.webp',
    atlasUrl: '/fixtures/rack/cards-pink-v3/atlas.webp',
    backUrl: '/fixtures/rack/cards-pink-v3/back.webp',
  },
  {
    name: 'Desert Dune Sand (Atelier Tee)',
    folder: 'tee',
    colorHex: '#D2C1A8',
    colorName: 'Desert Dune Sand',
    profileUrl: '/fixtures/rack/tee/profile.webp',
    frontUrl: '/fixtures/rack/tee/front.webp',
    atlasUrl: '/fixtures/rack/tee/atlas.webp',
    backUrl: '/fixtures/rack/tee/back.webp',
  },
];

export default function AdminClothingRackPage() {
  const { success, error } = useToast();
  const [items, setItems] = useState<RackGarmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RackGarmentItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [colorName, setColorName] = useState('Charcoal Noir');
  const [colorHex, setColorHex] = useState('#18181B');
  const [fabric, setFabric] = useState('100% Combed Compact Cotton');
  const [price, setPrice] = useState<number>(2499);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(3499);
  const [badge, setBadge] = useState('AUTUMN / WINTER 26');
  const [description, setDescription] = useState('');
  const [fixtureFolder, setFixtureFolder] = useState('hoodie');
  const [profileUrl, setProfileUrl] = useState('/fixtures/rack/hoodie/profile.webp');
  const [frontUrl, setFrontUrl] = useState('/fixtures/rack/hoodie/front.webp');
  const [atlasUrl, setAtlasUrl] = useState('/fixtures/rack/hoodie/atlas.webp');
  const [backUrl, setBackUrl] = useState('/fixtures/rack/hoodie/back.webp');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clothing-rack');
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      } else {
        error('Error', data.message || 'Failed to fetch rack items');
      }
    } catch {
      error('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const selectPreset = (preset: typeof PRESET_STYLES[0]) => {
    setFixtureFolder(preset.folder);
    setColorHex(preset.colorHex);
    setColorName(preset.colorName);
    setProfileUrl(preset.profileUrl);
    setFrontUrl(preset.frontUrl);
    setAtlasUrl(preset.atlasUrl);
    setBackUrl(preset.backUrl);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setSubtitle('340 GSM Heavyweight French Jersey');
    setSlug('');
    setColorName('Charcoal Noir');
    setColorHex('#18181B');
    setFabric('100% Combed Compact Cotton');
    setPrice(2499);
    setCompareAtPrice(3499);
    setBadge('AUTUMN / WINTER 26');
    setDescription('Architectural cut with reinforced seams and silk-like drape.');
    selectPreset(PRESET_STYLES[0]);
    setDisplayOrder(items.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: RackGarmentItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSubtitle(item.subtitle || '');
    setSlug(item.slug || '');
    setColorName(item.color_name || '');
    setColorHex(item.color_hex || '#000000');
    setFabric(item.fabric || '');
    setPrice(item.price || 1999);
    setCompareAtPrice(item.compare_at_price || 2999);
    setBadge(item.badge || '');
    setDescription(item.description || '');
    setFixtureFolder(item.fixture_folder || 'lake-white-v3');
    setProfileUrl(item.profile_url || '/fixtures/rack/lake-white-v3/profile.webp');
    setFrontUrl(item.front_url || '/fixtures/rack/lake-white-v3/front.webp');
    setAtlasUrl(item.atlas_url || '/fixtures/rack/lake-white-v3/atlas.webp');
    setBackUrl(item.back_url || '/fixtures/rack/lake-white-v3/back.webp');
    setDisplayOrder(item.display_order);
    setIsActive(Boolean(item.is_active));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error('Validation', 'Garment title is required');
      return;
    }

    setSubmitting(true);
    try {
      const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload: Partial<RackGarmentItem> = {
        id: editingItem?.id,
        title: title.trim(),
        subtitle: subtitle.trim(),
        slug: generatedSlug,
        color_name: colorName.trim(),
        color_hex: colorHex,
        fabric: fabric.trim(),
        price: Number(price),
        compare_at_price: Number(compareAtPrice),
        badge: badge.trim(),
        description: description.trim(),
        fixture_folder: fixtureFolder,
        profile_url: profileUrl.trim(),
        front_url: frontUrl.trim(),
        atlas_url: atlasUrl.trim(),
        back_url: backUrl.trim(),
        display_order: Number(displayOrder),
        is_active: isActive,
      };

      const res = await fetch('/api/admin/clothing-rack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success('Success', editingItem ? 'Rack garment updated' : 'New rack garment added');
        setIsModalOpen(false);
        fetchItems();
      } else {
        error('Error', data.message || 'Failed to save rack garment');
      }
    } catch {
      error('Error', 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${itemTitle}" from the interactive rack?`)) return;

    try {
      const res = await fetch(`/api/admin/clothing-rack?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        success('Removed', `"${itemTitle}" removed from rack`);
        fetchItems();
      } else {
        error('Error', data.message || 'Failed to remove garment');
      }
    } catch {
      error('Error', 'Deletion request failed');
    }
  };

  const toggleItemActive = async (item: RackGarmentItem) => {
    try {
      const res = await fetch('/api/admin/clothing-rack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_active: !item.is_active,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i)));
        success('Status Updated', `Garment visibility updated`);
      }
    } catch {
      error('Error', 'Failed to toggle status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono tracking-widest uppercase">
            <Shirt className="w-3.5 h-3.5 text-black" />
            <span>Hero Interactive Atelier Rack</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-black mt-1">Clothing Rack Collection</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage photorealistic 3D spinning garments featured on the homepage interactive rack.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors border border-zinc-300"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Store</span>
          </Link>

          <button
            onClick={fetchItems}
            className="p-2 text-zinc-600 hover:text-black border border-zinc-300 hover:bg-zinc-100 transition-colors"
            title="Refresh Garments"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rack Garment</span>
          </button>
        </div>
      </div>

      {/* Rack Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">Total Garments</span>
          <span className="text-2xl font-mono font-bold text-black mt-1 block">{items.length}</span>
        </div>
        <div className="p-4 bg-white border border-zinc-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">Active on Rack</span>
          <span className="text-2xl font-mono font-bold text-emerald-600 mt-1 block">
            {items.filter((i) => i.is_active).length}
          </span>
        </div>
        <div className="p-4 bg-white border border-zinc-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">Rotation Quality</span>
          <span className="text-2xl font-mono font-bold text-black mt-1 block flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>30-Frame 3D</span>
          </span>
        </div>
      </div>

      {/* Garments Table & Card Listing */}
      <div className="bg-white border border-zinc-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs tracking-widest uppercase text-zinc-400 font-mono">
            Loading Rack Collection...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Shirt className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-sm text-zinc-600 font-medium">No garments currently configured on the rack.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold"
            >
              Add First Garment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
              >
                {/* Left: Thumbnail & Main Dossier */}
                <div className="flex items-center gap-4">
                  {/* Side Profile Thumbnail on Hanger */}
                  <div className="relative w-16 h-20 bg-[#FAF9F5] border border-zinc-200 rounded shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                    <Image
                      src={item.profile_url || '/fixtures/rack/lake-white-v3/profile.webp'}
                      alt={item.title}
                      width={64}
                      height={80}
                      className="object-contain w-full h-full p-1"
                    />
                    <span className="absolute bottom-0 right-0 px-1 text-[8px] font-mono font-bold bg-black/70 text-white">
                      Profile
                    </span>
                  </div>

                  {/* Front View Thumbnail */}
                  <div className="relative w-16 h-20 bg-[#FAF9F5] border border-zinc-200 rounded shrink-0 flex items-center justify-center overflow-hidden shadow-xs hidden sm:flex">
                    <Image
                      src={item.front_url || '/fixtures/rack/lake-white-v3/front.webp'}
                      alt={item.title}
                      width={64}
                      height={80}
                      className="object-contain w-full h-full p-1"
                    />
                    <span className="absolute bottom-0 right-0 px-1 text-[8px] font-mono font-bold bg-black/70 text-white">
                      Front
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black text-[#C5A880]">
                        {item.badge || 'ATELIER'}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">Order #{item.display_order}</span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-black">{item.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span
                          className="w-3 h-3 rounded-full border border-zinc-300 inline-block shadow-xs"
                          style={{ backgroundColor: item.color_hex || '#000' }}
                        />
                        <span>{item.color_name}</span>
                      </span>
                      <span>•</span>
                      <span>{item.subtitle}</span>
                      <span>•</span>
                      <span className="font-mono font-bold text-black">₹{item.price.toLocaleString('en-IN')}</span>
                      {item.compare_at_price && (
                        <span className="text-[11px] text-zinc-400 line-through">
                          ₹{item.compare_at_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => toggleItemActive(item)}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-colors ${
                      item.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-zinc-100 text-zinc-400 border-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-200 rounded transition-colors"
                    title="Edit Garment"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete Garment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-zinc-300 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-black">
                  {editingItem ? 'Edit Rack Garment' : 'Add Garment to Clothing Rack'}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Configure apparel metadata, pricing, and 3D rotation graphics.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Preset Selector */}
              <div className="p-4 bg-[#FAF9F5] border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Choose 3D Rotation Colorway Preset</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">Auto-links 30-frame spritesheets</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {PRESET_STYLES.map((preset) => {
                    const isSelected = fixtureFolder === preset.folder;
                    return (
                      <button
                        type="button"
                        key={preset.folder}
                        onClick={() => selectPreset(preset)}
                        className={`p-2 border text-left flex flex-col items-center text-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-black bg-white shadow-md ring-1 ring-black'
                            : 'border-zinc-200 bg-zinc-50 hover:bg-white'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-zinc-300 shadow-xs"
                          style={{ backgroundColor: preset.colorHex }}
                        />
                        <span className="text-[10px] font-bold text-zinc-800 leading-tight">
                          {preset.colorName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Garment Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sovereign Supima® Alpine Tee"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Silhouette / Subtitle</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. 190 GSM Extra-Long Staple Cotton"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              {/* Price & Compare At Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Retail Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Compare Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Badge / Drop Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. FLAGSHIP CLASSIC"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              {/* Color Name, Color Hex & Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Colorway Name</label>
                  <input
                    type="text"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    placeholder="e.g. Chalk White"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Color Hex Code</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-9 h-9 p-0.5 border border-zinc-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono border border-zinc-300 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Fabric Composition</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% American Supima® Cotton"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-black">Garment Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural tailoring and hand-finished details..."
                  className="w-full px-3 py-2 text-sm border border-zinc-300 focus:outline-hidden focus:border-black"
                />
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">Rail Position Order</label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-zinc-300 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-black focus:ring-black border-zinc-300 rounded"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-black">
                      Active (Display on Storefront Rack)
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-xs uppercase tracking-wider font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-black text-white text-xs uppercase tracking-wider font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Garment' : 'Add to Rack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
