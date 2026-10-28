'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Palette,
  Sparkles
} from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useToast } from '@/context/toast-context';

interface ProductFormProps {
  initialProduct?: Product;
  isEdit?: boolean;
}

const DEFAULT_CATEGORIES = [
  { id: 'cat_t-shirts', name: 'T-Shirts' },
  { id: 'cat_oversized-t-shirt', name: 'Oversized T-Shirts' },
  { id: 'cat_hoodies', name: 'Hoodies' },
  { id: 'cat_polo-t-shirts', name: 'Polo T-Shirts' },
  { id: 'cat_sweaters', name: 'Sweatshirts' },
  { id: 'cat-henleys', name: 'Henleys' },
  { id: 'cat_jeans-shirt', name: 'Jeans & Shirts' },
  { id: 'cat_trending', name: 'Trending' },
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

const COLOR_PRESETS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Heather Grey', hex: '#71717A' },
  { name: 'Navy Blue', hex: '#0C172D' },
  { name: 'Olive Green', hex: '#3F4A3C' },
  { name: 'Sand / Beige', hex: '#D4C5B9' },
  { name: 'Dusty Pink', hex: '#E2B8B8' },
  { name: 'Maroon', hex: '#631D24' },
];

interface SimpleColorway {
  id: string;
  colorName: string;
  colorHex: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  sizes: { [size: string]: boolean };
  sizeStock: { [size: string]: number };
  stockPerSize: number;
}

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { success, error } = useToast();

  // Basic Details
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || DEFAULT_CATEGORIES[0].id);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCatName, setCustomCatName] = useState('');

  // Pricing
  const [price, setPrice] = useState<number | string>(initialProduct?.price ?? 1999);
  const [comparePrice, setComparePrice] = useState<number | string>(initialProduct?.compare_at_price ?? 2499);

  // Description
  const [description, setDescription] = useState(initialProduct?.description || '');

  // Colorways & Sizes
  const [colorways, setColorways] = useState<SimpleColorway[]>(() => {
    if (initialProduct?.variants && initialProduct.variants.length > 0) {
      // Group by color name
      const map = new Map<string, SimpleColorway>();
      initialProduct.variants.forEach((v) => {
        const key = v.color_name || 'Standard';
        if (!map.has(key)) {
          const sizeMap: { [size: string]: boolean } = {};
          const stockMap: { [size: string]: number } = {};
          STANDARD_SIZES.forEach((s) => {
            sizeMap[s] = false;
            stockMap[s] = 20;
          });
          map.set(key, {
            id: `cw_${Math.random().toString(36).substring(2, 7)}`,
            colorName: key,
            colorHex: v.color_hex || '#111111',
            imageUrl: v.image_url || '',
            secondaryImageUrl: v.secondary_image_url || '',
            sizes: sizeMap,
            sizeStock: stockMap,
            stockPerSize: v.stock || 20,
          });
        }
        const cw = map.get(key)!;
        cw.sizes[v.size] = true;
        cw.sizeStock[v.size] = v.stock ?? 20;
      });
      return Array.from(map.values());
    }

    // Default for new product: 1 clean colorway with S, M, L, XL selected
    const initialSizes: { [size: string]: boolean } = {};
    const initialStock: { [size: string]: number } = {};
    STANDARD_SIZES.forEach((s) => {
      initialSizes[s] = ['S', 'M', 'L', 'XL'].includes(s);
      initialStock[s] = 20;
    });

    return [
      {
        id: `cw_init_${Date.now()}`,
        colorName: 'Midnight Black',
        colorHex: '#111111',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
        secondaryImageUrl: '',
        sizes: initialSizes,
        sizeStock: initialStock,
        stockPerSize: 20,
      },
    ];
  });

  // Flags
  const [isFeatured, setIsFeatured] = useState(Boolean(initialProduct?.is_featured));
  const [isNew, setIsNew] = useState(Boolean(initialProduct?.is_new ?? true));

  // Advanced / Optional Details
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fit, setFit] = useState(initialProduct?.fit || 'Relaxed Boxy Fit');
  const [fabricDetails, setFabricDetails] = useState(initialProduct?.fabric_details || '100% Combed Compact Cotton (240 GSM)');
  const [careInstructions, setCareInstructions] = useState(initialProduct?.care_instructions || 'Machine wash cold with like colours. Tumble dry low.');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');

  // Uploading state
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load existing categories dynamically from D1
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const map = new Map<string, { id: string; name: string }>();
          DEFAULT_CATEGORIES.forEach((c) => map.set(c.id, c));
          data.categories.forEach((c: { id: string; name: string }) => map.set(c.id, { id: c.id, name: c.name }));
          setCategories(Array.from(map.values()));
        }
      } catch (err) {
        console.warn('Could not load categories dynamically, using defaults', err);
      }
    }
    loadCategories();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleAddColorway = (preset?: typeof COLOR_PRESETS[0]) => {
    const initialSizes: { [size: string]: boolean } = {};
    const initialStock: { [size: string]: number } = {};
    STANDARD_SIZES.forEach((s) => {
      initialSizes[s] = ['S', 'M', 'L', 'XL'].includes(s);
      initialStock[s] = 20;
    });

    setColorways([
      ...colorways,
      {
        id: `cw_${Date.now()}`,
        colorName: preset ? preset.name : `Colour ${colorways.length + 1}`,
        colorHex: preset ? preset.hex : '#111111',
        imageUrl: colorways[0]?.imageUrl || '',
        sizes: initialSizes,
        sizeStock: initialStock,
        stockPerSize: 20,
      },
    ]);
  };

  const applyBulkStock = (cwIdx: number, qty: number) => {
    const safe = Math.max(0, Math.floor(qty));
    setColorways((prev) => {
      const updated = [...prev];
      const cw = updated[cwIdx];
      const newStock: { [size: string]: number } = { ...(cw.sizeStock || {}) };
      STANDARD_SIZES.forEach((s) => {
        newStock[s] = safe;
      });
      cw.sizeStock = newStock;
      cw.stockPerSize = safe;
      return updated;
    });
    success('Stock Updated', `All sizes for ${colorways[cwIdx].colorName} set to ${safe} units.`);
  };

  const handleRemoveColorway = (idx: number) => {
    if (colorways.length === 1) {
      error('Minimum Required', 'At least one colourway is required.');
      return;
    }
    setColorways(colorways.filter((_, i) => i !== idx));
  };

  const toggleSize = (cwIdx: number, size: string) => {
    setColorways((prev) => {
      const updated = [...prev];
      const currentSizes = { ...updated[cwIdx].sizes };
      currentSizes[size] = !currentSizes[size];
      updated[cwIdx].sizes = currentSizes;
      return updated;
    });
  };

  // Image Upload handler (Cloudflare R2)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, cwIdx: number, isSecondary = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(cwIdx);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setColorways((prev) => {
          const updated = [...prev];
          if (isSecondary) {
            updated[cwIdx].secondaryImageUrl = data.url;
          } else {
            updated[cwIdx].imageUrl = data.url;
          }
          return updated;
        });
        success('Photo Uploaded', 'Image stored successfully.');
      } else {
        error('Upload Failed', data.message || 'Image could not be uploaded');
      }
    } catch {
      error('Upload Error', 'Could not upload image');
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error('Validation', 'Please enter a product title');
      return;
    }

    if (!price || Number(price) <= 0) {
      error('Validation', 'Please enter a valid selling price');
      return;
    }

    const finalCategoryId =
      isCustomCategory && customCatName.trim()
        ? `cat_${customCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : categoryId;

    // Flatten colorways into ProductVariant[]
    const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const variants: ProductVariant[] = [];

    colorways.forEach((cw) => {
      const activeSizes = Object.keys(cw.sizes).filter((s) => cw.sizes[s]);
      // If no size toggled, at least enable M
      const sizesToUse = activeSizes.length > 0 ? activeSizes : ['M'];

      sizesToUse.forEach((size) => {
        const stockQty = cw.sizeStock?.[size] !== undefined ? Number(cw.sizeStock[size]) : Number(cw.stockPerSize) || 20;
        variants.push({
          id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          product_id: initialProduct?.id || '',
          color_name: cw.colorName || 'Standard',
          color_hex: cw.colorHex || '#111111',
          size,
          stock: stockQty,
          sku: `AV-${generatedSlug.toUpperCase().substring(0, 4)}-${cw.colorName.substring(0, 3).toUpperCase()}-${size}`,
          image_url: cw.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
          secondary_image_url: cw.secondaryImageUrl || undefined,
        });
      });
    });

    setSubmitting(true);
    const payload = {
      product: {
        id: initialProduct?.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        slug: generatedSlug,
        tagline: tagline.trim() || undefined,
        description: description.trim() || `${title} crafted with premium combed cotton for everyday comfort.`,
        fabric_details: fabricDetails.trim(),
        care_instructions: careInstructions.trim(),
        fit,
        price: Number(price),
        compare_at_price: comparePrice ? Number(comparePrice) : undefined,
        category_id: finalCategoryId,
        is_featured: isFeatured,
        is_new: isNew,
        is_bestseller: false,
      },
      variants,
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialProduct?.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success('Success', isEdit ? 'Product updated successfully' : 'Product published successfully');
        router.push('/nirvignastudio/products');
        router.refresh();
      } else {
        error('Error', data.message || 'Failed to save product');
      }
    } catch {
      error('Error', 'Failed to communicate with server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <Link
          href="/nirvignastudio/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-widest font-bold shadow-sm transition-all disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}</span>
        </button>
      </div>

      {/* 1. BASIC PRODUCT INFO */}
      <div className="bg-white p-6 border border-zinc-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-zinc-100 pb-2">
          1. Product Essentials
        </h2>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-black">Product Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Signature Heavyweight Oversized Tee"
            className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-300 focus:outline-hidden focus:border-black font-medium"
          />
        </div>

        {/* Category & Pricing in One Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Category */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-black">Category *</label>
              <button
                type="button"
                onClick={() => setIsCustomCategory(!isCustomCategory)}
                className="text-[10px] text-zinc-500 hover:text-black underline"
              >
                {isCustomCategory ? 'Select List' : '+ Custom'}
              </button>
            </div>
            {isCustomCategory ? (
              <input
                type="text"
                required
                value={customCatName}
                onChange={(e) => setCustomCatName(e.target.value)}
                placeholder="Enter category name..."
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-hidden focus:border-black"
              />
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-hidden focus:border-black"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selling Price */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-black">Selling Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-zinc-400 font-serif">₹</span>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1999"
                className="w-full pl-7 pr-3 py-2 text-sm font-bold bg-zinc-50 border border-zinc-300 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          {/* Compare Price */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">Strike Price (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-zinc-400 font-serif">₹</span>
              <input
                type="number"
                min={0}
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="2499"
                className="w-full pl-7 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-300 focus:outline-hidden focus:border-black text-zinc-600"
              />
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-bold uppercase tracking-wider text-black">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the fabric, feel, fit, and styling tips..."
            className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-hidden focus:border-black leading-relaxed"
          />
        </div>
      </div>

      {/* 2. PHOTOS, COLORS & SIZES */}
      <div className="bg-white p-6 border border-zinc-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>2. Photos, Colors &amp; Sizes</span>
          </h2>

          <button
            type="button"
            onClick={() => handleAddColorway()}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white hover:bg-zinc-800 text-[11px] font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Colorway</span>
          </button>
        </div>

        {/* Colorway Cards */}
        <div className="space-y-4">
          {colorways.map((cw, idx) => (
            <div
              key={cw.id}
              className="p-4 sm:p-5 border border-zinc-200 bg-[#FAFAFA] space-y-4 rounded-xs"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full border border-zinc-400 shadow-xs"
                    style={{ backgroundColor: cw.colorHex }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Color #{idx + 1}: {cw.colorName || 'Default Color'}
                  </span>
                </div>

                {colorways.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColorway(idx)}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Color Name & Swatch Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Color Name</label>
                  <input
                    type="text"
                    value={cw.colorName}
                    onChange={(e) => {
                      const updated = [...colorways];
                      updated[idx].colorName = e.target.value;
                      setColorways(updated);
                    }}
                    placeholder="e.g. Midnight Black"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-300 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Color Swatch</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cw.colorHex}
                      onChange={(e) => {
                        const updated = [...colorways];
                        updated[idx].colorHex = e.target.value;
                        setColorways(updated);
                      }}
                      className="w-8 h-8 p-0.5 border border-zinc-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cw.colorHex}
                      onChange={(e) => {
                        const updated = [...colorways];
                        updated[idx].colorHex = e.target.value;
                        setColorways(updated);
                      }}
                      className="w-24 px-2 py-1.5 text-xs font-mono uppercase bg-white border border-zinc-300 font-bold"
                    />
                    {/* Quick Preset Swatches */}
                    <div className="flex items-center gap-1 pl-1">
                      {COLOR_PRESETS.slice(0, 5).map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            const updated = [...colorways];
                            updated[idx].colorHex = p.hex;
                            updated[idx].colorName = p.name;
                            setColorways(updated);
                          }}
                          className="w-5 h-5 rounded-full border border-zinc-300 hover:scale-110 transition-transform shadow-2xs"
                          style={{ backgroundColor: p.hex }}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Photo Upload / URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                    Primary / Front Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cw.imageUrl}
                      onChange={(e) => {
                        const updated = [...colorways];
                        updated[idx].imageUrl = e.target.value;
                        setColorways(updated);
                      }}
                      placeholder="https://... or upload photo"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-300 focus:outline-hidden focus:border-black font-mono"
                    />
                    <label className="cursor-pointer px-3 py-1.5 bg-black text-white hover:bg-zinc-800 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors">
                      {uploadingIdx === idx ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Upload
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, idx, false)}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                    Back / Secondary Image (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cw.secondaryImageUrl || ''}
                      onChange={(e) => {
                        const updated = [...colorways];
                        updated[idx].secondaryImageUrl = e.target.value;
                        setColorways(updated);
                      }}
                      placeholder="https://... (optional)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-300 focus:outline-hidden focus:border-black font-mono"
                    />
                    <label className="cursor-pointer px-3 py-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, idx, true)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Image Preview */}
              {cw.imageUrl && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative w-14 h-16 bg-white border border-zinc-200 rounded overflow-hidden shadow-xs">
                    <Image
                      src={cw.imageUrl}
                      alt={cw.colorName}
                      fill
                      sizes="64px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  {cw.secondaryImageUrl && (
                    <div className="relative w-14 h-16 bg-white border border-zinc-200 rounded overflow-hidden shadow-xs">
                      <Image
                        src={cw.secondaryImageUrl}
                        alt="Secondary angle"
                        fill
                        sizes="64px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  )}
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Photo verified &amp; ready for catalog
                  </span>
                </div>
              )}

              {/* Sizes & Individual Stock per Size */}
              <div className="pt-3 border-t border-zinc-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
                      Available Sizes &amp; Stock per Size
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Toggle sizes on/off and set individual stock for each size.
                    </span>
                  </div>

                  {/* Bulk Set Shortcut */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-100 px-2 py-1 border border-zinc-200 rounded-xs">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Set All:</span>
                    <input
                      type="number"
                      min={0}
                      defaultValue={20}
                      id={`bulk-stock-input-${idx}`}
                      className="w-14 px-1.5 py-0.5 text-xs font-mono font-bold text-center bg-white border border-zinc-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(`bulk-stock-input-${idx}`) as HTMLInputElement;
                        const val = Number(el?.value);
                        if (!isNaN(val) && val >= 0) {
                          applyBulkStock(idx, val);
                        }
                      }}
                      className="px-2 py-0.5 text-[10px] uppercase font-bold bg-black text-white hover:bg-zinc-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Per-Size Interactive Cards */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                  {STANDARD_SIZES.map((size) => {
                    const isSelected = Boolean(cw.sizes[size]);
                    const currentStock = cw.sizeStock?.[size] !== undefined ? cw.sizeStock[size] : cw.stockPerSize ?? 20;

                    return (
                      <div
                        key={size}
                        className={`p-2 border transition-all text-center rounded-xs flex flex-col justify-between ${
                          isSelected
                            ? 'border-black bg-white shadow-xs'
                            : 'border-zinc-200 bg-zinc-100/50 opacity-50'
                        }`}
                      >
                        {/* Size Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleSize(idx, size)}
                          className={`w-full py-1 text-xs font-mono font-bold transition-colors ${
                            isSelected ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                          }`}
                          title={`Click to ${isSelected ? 'disable' : 'enable'} Size ${size}`}
                        >
                          Size {size}
                        </button>

                        {/* Individual Stock Input for this Size */}
                        <div className="mt-2 space-y-0.5">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
                            {isSelected ? 'Stock' : 'Off'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            disabled={!isSelected}
                            value={isSelected ? currentStock : ''}
                            placeholder={isSelected ? '0' : '—'}
                            onChange={(e) => {
                              const updated = [...colorways];
                              if (!updated[idx].sizeStock) {
                                updated[idx].sizeStock = {};
                              }
                              updated[idx].sizeStock[size] = Math.max(0, Number(e.target.value));
                              setColorways(updated);
                            }}
                            className="w-full px-1 py-1 text-xs font-mono font-bold text-center bg-white border border-zinc-300 focus:outline-hidden focus:border-black disabled:bg-zinc-100 disabled:text-zinc-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STOREFRONT HIGHLIGHTS */}
      <div className="bg-white p-5 border border-zinc-200 shadow-xs flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-black focus:ring-black border-zinc-300 rounded"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-black block">Featured on Homepage</span>
            <span className="text-[10px] text-zinc-500">Showcases in top trending drops</span>
          </div>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="w-4 h-4 text-black focus:ring-black border-zinc-300 rounded"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-black block">New Arrival Badge</span>
            <span className="text-[10px] text-zinc-500">Displays "NEW" ribbon on product card</span>
          </div>
        </label>
      </div>

      {/* 4. ADVANCED / OPTIONAL ACCORDION */}
      <div className="bg-white border border-zinc-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 text-left flex items-center justify-between text-xs uppercase tracking-wider font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <span>Advanced Options (Slug, Fit, Fabric &amp; Care Details)</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-5 border-t border-zinc-200 bg-zinc-50/50 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-zinc-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Silhouette / Fit</label>
                <select
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300"
                >
                  <option value="Relaxed Boxy Fit">Relaxed Boxy Fit</option>
                  <option value="Tailored Fit">Tailored Fit</option>
                  <option value="Slim Tailored">Slim Tailored</option>
                  <option value="Oversized Streetwear">Oversized Streetwear</option>
                  <option value="Regular European Fit">Regular European Fit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Fabric Composition</label>
                <input
                  type="text"
                  value={fabricDetails}
                  onChange={(e) => setFabricDetails(e.target.value)}
                  placeholder="e.g. 100% Combed Compact Cotton (240 GSM)"
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Care Instructions</label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Machine wash cold with like colours"
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save & Cancel Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/nirvignastudio/products"
          className="px-5 py-2.5 border border-zinc-300 text-zinc-700 text-xs uppercase tracking-wider font-semibold hover:bg-zinc-100 transition-colors"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-widest font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{submitting ? 'Publishing...' : isEdit ? 'Update Garment' : 'Publish Product'}</span>
        </button>
      </div>
    </form>
  );
}
