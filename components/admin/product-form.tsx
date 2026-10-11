'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Check,
  Sparkles,
  RefreshCw,
  X,
  Palette,
  Minus,
  Layers,
  Boxes,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useToast } from '@/context/toast-context';
import Link from 'next/link';

interface ProductFormProps {
  initialProduct?: Product;
  isEdit?: boolean;
}

const DEFAULT_CATEGORIES = [
  { id: 'cat_hoodies', name: 'Hoodies' },
  { id: 'cat_oversized-t-shirt', name: 'Oversized T-Shirt' },
  { id: 'cat_jeans-shirt', name: 'Jeans shirt' },
  { id: 'cat_polo-t-shirts', name: 'Polo T-Shirts' },
  { id: 'cat_t-shirts', name: 'T-Shirts' },
  { id: 'cat_sweaters', name: 'Sweatshirt' },
  { id: 'cat_lower-tshirt', name: 'Lower tshirt' },
  { id: 'cat_best-selling', name: 'Best Selling' },
  { id: 'cat_hot-sale', name: 'Hot sale' },
  { id: 'cat_trending', name: 'Trending' },
  { id: 'cat_unique-design-clothes', name: 'Unique Design Clothes' },
  { id: 'cat-polos', name: 'Luxury Polos' },
  { id: 'cat-crew-neck', name: 'Supima Crew Necks' },
  { id: 'cat-henleys', name: 'Mercerized Henleys' },
  { id: 'cat-oversized', name: 'Modern Relaxed & Oversized' },
  { id: 'cat-graphic-art', name: 'Artisan & Graphic Editions' },
  { id: 'cat-custom-bespoke', name: 'Bespoke & Custom Studio' },
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

const COLOR_PRESETS = [
  { name: 'Midnight Black', hex: '#111111' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Heather Grey', hex: '#71717A' },
  { name: 'Charcoal Grey', hex: '#27272A' },
  { name: 'Navy Blue', hex: '#0C172D' },
  { name: 'Royal Blue', hex: '#1E3A8A' },
  { name: 'Olive Green', hex: '#3F4A3C' },
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Sand / Beige', hex: '#D4C5B9' },
  { name: 'Burgundy / Maroon', hex: '#631D24' },
  { name: 'Crimson Red', hex: '#B91C1C' },
  { name: 'Dusty Pink', hex: '#F472B6' },
  { name: 'Lavender', hex: '#C084FC' },
  { name: 'Mustard Yellow', hex: '#CA8A04' },
];

interface SizeConfig {
  size: string;
  enabled: boolean;
  stock: number;
  sku: string;
  id?: string;
}

interface ColorwayGroup {
  id: string;
  color_name: string;
  color_hex: string;
  image_url: string;
  secondary_image_url?: string;
  gallery_images?: string[];
  galleryUrlInput?: string;
  sizes: SizeConfig[];
  customSizeInput?: string;
}

function generateDefaultSku(productSlug: string, colorName: string, size: string): string {
  const cleanSlug = (productSlug || 'ITEM').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  const cleanColor = (colorName || 'CLR').replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
  const cleanSize = (size || 'M').toUpperCase();
  return `ST-${cleanSlug}-${cleanColor}-${cleanSize}`;
}

function initializeColorways(variants?: ProductVariant[], currentSlug: string = 'ITEM'): ColorwayGroup[] {
  if (!variants || variants.length === 0) {
    return [
      {
        id: `cw_${Date.now()}_1`,
        color_name: 'Midnight Black',
        color_hex: '#111111',
        image_url: 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/Men_SSpiderPrintedHoodie.jpg?v=1737624764&width=800',
        secondary_image_url: '',
        gallery_images: [],
        sizes: STANDARD_SIZES.map((size) => ({
          size,
          enabled: ['S', 'M', 'L', 'XL'].includes(size),
          stock: size === 'M' ? 20 : 15,
          sku: generateDefaultSku(currentSlug, 'Midnight Black', size),
        })),
      },
    ];
  }

  // Group existing variants by color_name
  const colorMap = new Map<string, { hex: string; image_url: string; secondary_image_url?: string; variantList: ProductVariant[] }>();
  variants.forEach((v) => {
    const key = v.color_name || 'Standard';
    if (!colorMap.has(key)) {
      colorMap.set(key, {
        hex: v.color_hex || '#111111',
        image_url: v.image_url || '',
        secondary_image_url: v.secondary_image_url || '',
        variantList: [],
      });
    }
    colorMap.get(key)!.variantList.push(v);
  });

  const result: ColorwayGroup[] = [];
  let idx = 1;
  colorMap.forEach((data, colorName) => {
    // Collect all sizes used in these variants
    const usedSizes = data.variantList.map((v) => v.size);
    // Combine standard sizes with any non-standard sizes that exist
    const allSizesSet = new Set([...STANDARD_SIZES, ...usedSizes]);
    const sizes: SizeConfig[] = Array.from(allSizesSet).map((size) => {
      const match = data.variantList.find((v) => v.size === size);
      return {
        size,
        enabled: Boolean(match),
        stock: match ? match.stock : 15,
        sku: match ? match.sku : generateDefaultSku(currentSlug, colorName, size),
        id: match?.id,
      };
    });

    result.push({
      id: `cw_${Date.now()}_${idx++}`,
      color_name: colorName,
      color_hex: data.hex,
      image_url: data.image_url,
      secondary_image_url: data.secondary_image_url || '',
      gallery_images: [],
      sizes,
    });
  });

  return result.length > 0 ? result : initializeColorways(undefined, currentSlug);
}

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingColorwayIdx, setUploadingColorwayIdx] = useState<number | null>(null);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(DEFAULT_CATEGORIES);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCatName, setCustomCatName] = useState('');

  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || 'cat_hoodies');
  const [fit, setFit] = useState(initialProduct?.fit || 'Tailored Fit');
  const [price, setPrice] = useState<number | string>(initialProduct?.price || 1999);
  const [comparePrice, setComparePrice] = useState<number | string>(
    initialProduct?.compare_at_price || 2499
  );
  const [description, setDescription] = useState(
    initialProduct?.description ||
      'Engineered for connoisseurs of understated luxury. Crafted from rare, 100% American Supima® cotton for supreme softness and drape.'
  );
  const [fabricDetails, setFabricDetails] = useState(
    initialProduct?.fabric_details ||
      '100% Extra-Long Staple American Supima Cotton (190 GSM). Bio-washed for silkiness.'
  );
  const [careInstructions, setCareInstructions] = useState(
    initialProduct?.care_instructions ||
      'Gentle cold machine wash. Lay flat to dry in shade. Light steam press on reverse.'
  );

  const [isFeatured, setIsFeatured] = useState(Boolean(initialProduct?.is_featured));
  const [isNew, setIsNew] = useState(Boolean(initialProduct?.is_new));
  const [isBestseller, setIsBestseller] = useState(Boolean(initialProduct?.is_bestseller));

  // Structured Colorways with per-size stock
  const [colorways, setColorways] = useState<ColorwayGroup[]>(() =>
    initializeColorways(initialProduct?.variants, initialProduct?.slug || 'ITEM')
  );

  // Dynamic Categories from D1
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const map = new Map<string, { id: string; name: string }>();
          DEFAULT_CATEGORIES.forEach((c) => map.set(c.id, c));
          data.categories.forEach((c: { id: string; name: string }) => map.set(c.id, { id: c.id, name: c.name }));
          if (initialProduct?.category_id && !map.has(initialProduct.category_id)) {
            map.set(initialProduct.category_id, {
              id: initialProduct.category_id,
              name: initialProduct.category_name || initialProduct.category_id,
            });
          }
          setCategories(Array.from(map.values()));
        }
      } catch (err) {
        console.warn('Could not load categories dynamically, using defaults', err);
      }
    }
    loadCategories();
  }, [initialProduct]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const [newColorNameInput, setNewColorNameInput] = useState('');
  const [newColorHexInput, setNewColorHexInput] = useState('#111111');

  // Colorway handlers
  const handleAddColorway = (customName?: string, customHex?: string) => {
    let name = customName?.trim();
    let hex = customHex?.trim();

    if (!name) {
      // Pick next unused color preset
      const usedNames = colorways.map((cw) => cw.color_name.toLowerCase());
      const nextPreset = COLOR_PRESETS.find((p) => !usedNames.includes(p.name.toLowerCase())) || {
        name: `Colour ${colorways.length + 1}`,
        hex: '#27272A',
      };
      name = nextPreset.name;
      hex = hex || nextPreset.hex;
    }

    if (!hex) {
      hex = '#111111';
    }

    // Inherit the active sizes from the first colourway so user doesn't have to re-select sizes every time!
    const templateSizes = colorways[0]?.sizes || STANDARD_SIZES.map((size) => ({
      size,
      enabled: ['S', 'M', 'L', 'XL'].includes(size),
      stock: 15,
      sku: '',
    }));

    const newCw: ColorwayGroup = {
      id: `cw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      color_name: name,
      color_hex: hex,
      image_url: colorways[0]?.image_url || '',
      secondary_image_url: colorways[0]?.secondary_image_url || '',
      gallery_images: [],
      sizes: templateSizes.map((s) => ({
        size: s.size,
        enabled: s.enabled,
        stock: s.enabled ? (s.stock > 0 ? s.stock : 15) : 0,
        sku: generateDefaultSku(slug, name!, s.size),
      })),
    };

    setColorways((prev) => [...prev, newCw]);
    success('Colour Added', `Added "${name}" style to garment.`);
  };

  const handleCreateCustomColorway = () => {
    const trimmed = newColorNameInput.trim();
    if (!trimmed) {
      error('Colour Name Required', 'Please enter a colour name (e.g. Pink, Yellow, Lavender).');
      return;
    }
    handleAddColorway(trimmed, newColorHexInput);
    setNewColorNameInput('');
  };

  const handleRemoveColorway = (cwIndex: number) => {
    if (colorways.length <= 1) {
      error('Minimum Colorway Required', 'A garment must have at least one color style.');
      return;
    }
    setColorways(colorways.filter((_, idx) => idx !== cwIndex));
  };

  const handleUpdateColorway = (cwIndex: number, field: keyof ColorwayGroup, value: unknown) => {
    setColorways((prev) => {
      const updated = [...prev];
      updated[cwIndex] = { ...updated[cwIndex], [field]: value };
      // If color name changed, update SKUs
      if (field === 'color_name') {
        const newColorName = String(value);
        updated[cwIndex].sizes = updated[cwIndex].sizes.map((s) => ({
          ...s,
          sku: generateDefaultSku(slug, newColorName, s.size),
        }));
      }
      return updated;
    });
  };

  const handleToggleSize = (cwIndex: number, sizeName: string) => {
    setColorways((prev) => {
      const updated = [...prev];
      const cw = updated[cwIndex];
      cw.sizes = cw.sizes.map((s) => {
        if (s.size === sizeName) {
          const nextEnabled = !s.enabled;
          return {
            ...s,
            enabled: nextEnabled,
            stock: nextEnabled && s.stock === 0 ? 15 : s.stock,
            sku: s.sku || generateDefaultSku(slug, cw.color_name, s.size),
          };
        }
        return s;
      });
      return updated;
    });
  };

  const handleUpdateSizeStock = (cwIndex: number, sizeName: string, newStock: number) => {
    const safeStock = Math.max(0, Math.floor(newStock));
    setColorways((prev) => {
      const updated = [...prev];
      updated[cwIndex].sizes = updated[cwIndex].sizes.map((s) =>
        s.size === sizeName ? { ...s, stock: safeStock } : s
      );
      return updated;
    });
  };

  const handleUpdateSizeSku = (cwIndex: number, sizeName: string, newSku: string) => {
    setColorways((prev) => {
      const updated = [...prev];
      updated[cwIndex].sizes = updated[cwIndex].sizes.map((s) =>
        s.size === sizeName ? { ...s, sku: newSku } : s
      );
      return updated;
    });
  };

  const handleSetAllStockForColorway = (cwIndex: number, stockQty: number) => {
    const safeStock = Math.max(0, Math.floor(stockQty));
    setColorways((prev) => {
      const updated = [...prev];
      updated[cwIndex].sizes = updated[cwIndex].sizes.map((s) =>
        s.enabled ? { ...s, stock: safeStock } : s
      );
      return updated;
    });
    success('Bulk Stock Updated', `All active sizes in this colour set to ${safeStock} units.`);
  };

  const handleSelectAllSizesForColorway = (cwIndex: number) => {
    setColorways((prev) => {
      const updated = [...prev];
      const cw = updated[cwIndex];
      updated[cwIndex].sizes = cw.sizes.map((s) => ({
        ...s,
        enabled: true,
        stock: s.stock === 0 ? 15 : s.stock,
        sku: s.sku || generateDefaultSku(slug, cw.color_name, s.size),
      }));
      return updated;
    });
  };

  const handleAddCustomSize = (cwIndex: number, customSize: string) => {
    const trimmed = customSize.trim().toUpperCase();
    if (!trimmed) return;
    setColorways((prev) => {
      const updated = [...prev];
      const cw = updated[cwIndex];
      const exists = cw.sizes.some((s) => s.size === trimmed);
      if (exists) {
        // Just enable it
        cw.sizes = cw.sizes.map((s) => (s.size === trimmed ? { ...s, enabled: true } : s));
      } else {
        cw.sizes.push({
          size: trimmed,
          enabled: true,
          stock: 15,
          sku: generateDefaultSku(slug, cw.color_name, trimmed),
        });
      }
      return updated;
    });
  };

  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Cloudflare R2 Upload
  const handleR2Upload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cwIndex?: number,
    field: 'image_url' | 'secondary_image_url' | 'gallery' = 'image_url'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (cwIndex !== undefined) {
      setUploadingTarget(`cw_${cwIndex}_${field}`);
      setUploadingColorwayIdx(cwIndex);
    } else {
      setUploadingImage(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        if (cwIndex !== undefined) {
          if (field === 'gallery') {
            setColorways((prev) => {
              const updated = [...prev];
              const cw = updated[cwIndex];
              cw.gallery_images = [...(cw.gallery_images || []), data.url];
              return updated;
            });
          } else {
            handleUpdateColorway(cwIndex, field, data.url);
          }
        } else {
          // apply to all colourways missing an image
          setColorways((prev) =>
            prev.map((cw) => (!cw.image_url ? { ...cw, image_url: data.url } : cw))
          );
        }
        success('R2 Storage Upload', 'Image synced directly to Cloudflare R2 bucket.');
      } else {
        error('Upload Failed', data.message || 'Cloudflare R2 rejected upload');
      }
    } catch {
      error('Upload Error', 'Could not transmit image to Cloudflare R2');
    } finally {
      setUploadingTarget(null);
      if (cwIndex !== undefined) {
        setUploadingColorwayIdx(null);
      } else {
        setUploadingImage(false);
      }
    }
  };

  const handleRemoveGalleryImage = (cwIndex: number, imgIndex: number) => {
    setColorways((prev) => {
      const updated = [...prev];
      const cw = updated[cwIndex];
      cw.gallery_images = (cw.gallery_images || []).filter((_, idx) => idx !== imgIndex);
      return updated;
    });
  };

  const handleAddGalleryUrl = (cwIndex: number, url: string) => {
    if (!url || !url.trim()) return;
    setColorways((prev) => {
      const updated = [...prev];
      const cw = updated[cwIndex];
      cw.gallery_images = [...(cw.gallery_images || []), url.trim()];
      cw.galleryUrlInput = '';
      return updated;
    });
  };

  // Convert structured colorways back into flattened ProductVariant[]
  const flattenVariants = (): ProductVariant[] => {
    const flattened: ProductVariant[] = [];
    colorways.forEach((cw) => {
      const enabledSizes = cw.sizes.filter((s) => s.enabled);
      enabledSizes.forEach((s) => {
        flattened.push({
          id: s.id || `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          product_id: initialProduct?.id || '',
          color_name: cw.color_name || 'Standard',
          color_hex: cw.color_hex || '#111111',
          size: s.size,
          stock: Number(s.stock) || 0,
          sku: s.sku || generateDefaultSku(slug, cw.color_name, s.size),
          image_url: cw.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
          secondary_image_url: cw.secondary_image_url || undefined,
        });
      });
    });
    return flattened;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategoryId =
      isCustomCategory && customCatName.trim()
        ? `cat_${customCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : categoryId;

    if (!title || !price || !finalCategoryId) {
      error('Missing Information', 'Please complete all required garment attributes.');
      return;
    }

    const variants = flattenVariants();
    if (variants.length === 0) {
      error('No Sizes Selected', 'Please enable at least one size for your garment colourway.');
      return;
    }

    setSubmitting(true);
    const payload = {
      product: {
        id: initialProduct?.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title,
        slug,
        tagline,
        description,
        fabric_details: fabricDetails,
        care_instructions: careInstructions,
        fit,
        price: Number(price),
        compare_at_price: comparePrice ? Number(comparePrice) : undefined,
        category_id: finalCategoryId,
        is_featured: isFeatured,
        is_new: isNew,
        is_bestseller: isBestseller,
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
        success(
          isEdit ? 'Archive Updated' : 'Garment Catalogued',
          `${title} is now active with ${variants.length} variant configuration${variants.length > 1 ? 's' : ''}.`
        );
        router.push('/nirvignastudio/products');
        router.refresh();
      } else {
        error('Submission Failed', data.message);
      }
    } catch {
      error('Error', 'Failed to save product to Cloudflare D1');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculated totals for summary banner
  const totalColors = colorways.length;
  const totalVariantsCount = colorways.reduce(
    (acc, cw) => acc + cw.sizes.filter((s) => s.enabled).length,
    0
  );
  const totalStockCount = colorways.reduce(
    (acc, cw) =>
      acc +
      cw.sizes.filter((s) => s.enabled).reduce((sAcc, s) => sAcc + (Number(s.stock) || 0), 0),
    0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <Link
          href="/nirvignastudio/products"
          className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs uppercase tracking-wider font-semibold hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Product Archive
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          {submitting ? 'Preserving...' : isEdit ? 'Update Garment' : 'Publish Masterpiece'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Attributes & Colourway/Size Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-sans text-base font-bold text-black border-b border-zinc-100 pb-2">
              Garment Identity & Classification
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                Title / Model Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Sovereign Heavyweight Supima T-Shirt"
                className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sovereign-heavyweight-tshirt"
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Tagline / Fiber Hook
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="100% Extra-Long Staple American Supima®"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-[10px] text-zinc-500 hover:text-black underline"
                  >
                    {isCustomCategory ? 'Choose Existing' : '+ Custom Category'}
                  </button>
                </div>
                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    value={customCatName}
                    onChange={(e) => setCustomCatName(e.target.value)}
                    placeholder="Enter custom category name"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Silhouette / Fit
                </label>
                <select
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                >
                  <option value="Tailored Fit">Tailored Fit</option>
                  <option value="Slim Tailored">Slim Tailored</option>
                  <option value="Custom Fit">Custom Fit</option>
                  <option value="Relaxed Boxy Fit">Relaxed Boxy Fit</option>
                  <option value="Regular European Fit">Regular European Fit</option>
                  <option value="Oversized Streetwear">Oversized Streetwear</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                Editorial Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Fabric & Craft Details
                </label>
                <textarea
                  rows={2}
                  value={fabricDetails}
                  onChange={(e) => setFabricDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Care Instructions
                </label>
                <textarea
                  rows={2}
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* COLOURWAYS, SIZES & REAL-TIME STOCK MANAGER */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-black" />
                  <h3 className="font-sans text-base font-bold text-black uppercase tracking-wider">
                    Styles, Colours &amp; Size Inventory
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Configure each colourway, choose which sizes exist (S, M, L, etc.), and enter how much stock for each size.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Summary Stats Pill */}
                <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 border border-zinc-200 text-xs">
                  <span className="font-semibold text-black">{totalColors} Colour{totalColors > 1 ? 's' : ''}</span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-zinc-700">{totalVariantsCount} Sizes</span>
                  <span className="text-zinc-300">•</span>
                  <span className="font-mono font-bold text-black">{totalStockCount} Total Pcs</span>
                </div>

                {/* Primary Add Colour Button */}
                <button
                  type="button"
                  onClick={() => handleAddColorway()}
                  className="px-3.5 py-1.5 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Colour
                </button>
              </div>
            </div>

            {/* Quick Add Colours to Garment Toolbar */}
            <div className="bg-zinc-50 p-4 border border-zinc-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs uppercase tracking-wider font-bold text-black flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Select &amp; Add Colours to This Garment:
                </span>
                <span className="text-[11px] text-zinc-500">
                  Click any colour preset below to instantly add it to your product
                </span>
              </div>

              {/* Color Presets Palette */}
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PRESETS.map((p) => {
                  const isAlreadyAdded = colorways.some(
                    (cw) => cw.color_name.toLowerCase() === p.name.toLowerCase()
                  );
                  return (
                    <button
                      type="button"
                      key={p.name}
                      onClick={() => {
                        if (!isAlreadyAdded) {
                          handleAddColorway(p.name, p.hex);
                        }
                      }}
                      disabled={isAlreadyAdded}
                      className={`px-2.5 py-1 text-xs border flex items-center gap-1.5 transition-all ${
                        isAlreadyAdded
                          ? 'bg-zinc-200 text-zinc-500 border-zinc-300 opacity-60 cursor-default'
                          : 'bg-white hover:bg-black hover:text-white border-zinc-300 text-black font-semibold shadow-xs'
                      }`}
                      title={isAlreadyAdded ? `${p.name} is already added` : `Add ${p.name}`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-zinc-400 shrink-0 shadow-xs"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span>{p.name}</span>
                      {isAlreadyAdded ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-3 h-3 text-zinc-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Colour Form */}
              <div className="pt-2 border-t border-zinc-200 flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700">
                  + Add Custom Colour:
                </span>
                <input
                  type="text"
                  value={newColorNameInput}
                  onChange={(e) => setNewColorNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCustomColorway();
                    }
                  }}
                  placeholder="Colour name (e.g. Baby Pink, Lavender, Coral)..."
                  className="px-2.5 py-1.5 text-xs bg-white border border-zinc-300 w-60 focus:outline-none focus:border-black font-medium"
                />
                <div className="flex items-center gap-1.5 bg-white px-2 py-1 border border-zinc-300">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Swatch:</span>
                  <input
                    type="color"
                    value={newColorHexInput}
                    onChange={(e) => setNewColorHexInput(e.target.value)}
                    className="w-5 h-5 p-0 border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newColorHexInput}
                    onChange={(e) => setNewColorHexInput(e.target.value)}
                    className="w-16 text-xs font-mono uppercase bg-transparent border-0 focus:outline-none font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateCustomColorway}
                  className="px-3.5 py-1.5 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Colour
                </button>
              </div>
            </div>

            {/* Garment Photos & Quick Default Upload Bar */}
            <div className="bg-white p-4 border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-100 border border-zinc-300 text-black shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-black flex items-center gap-1.5">
                    Garment Photos &amp; Image Management (Cloudflare R2)
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Add front, back, and detail angle photos for each colourway below. All images sync directly to high-speed Cloudflare R2 object storage.
                  </p>
                </div>
              </div>

              <label className="cursor-pointer px-3.5 py-2 bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors shadow-xs">
                {uploadingImage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading to R2...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" /> + Quick Upload Default Photo
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(e) => handleR2Upload(e)}
                />
              </label>
            </div>

            {/* List of Individual Styles / Colourways */}
            <div className="space-y-6">
              {colorways.map((cw, cwIdx) => {
                const activeSizes = cw.sizes.filter((s) => s.enabled);
                const colorTotalStock = activeSizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);

                return (
                  <div
                    key={cw.id || cwIdx}
                    className="p-5 border border-zinc-300 bg-[#FAFAFA] space-y-5 transition-shadow hover:shadow-sm"
                  >
                    {/* Top Bar for this Colourway */}
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full border border-zinc-400 shadow-xs shrink-0"
                          style={{ backgroundColor: cw.color_hex }}
                        />
                        <div>
                          <span className="font-sans text-sm font-bold text-black uppercase tracking-wider">
                            Colourway #{cwIdx + 1}: {cw.color_name || 'Untitled Colour'}
                          </span>
                          <span className="text-[11px] text-zinc-500 block">
                            {activeSizes.length} size{activeSizes.length === 1 ? '' : 's'} active ({colorTotalStock} pieces in stock)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddColorway()}
                          className="px-2.5 py-1 text-xs uppercase tracking-wider font-bold text-black border border-zinc-300 hover:border-black bg-white hover:bg-zinc-100 flex items-center gap-1 transition-colors"
                          title="Add another colour"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Another Colour
                        </button>

                        {colorways.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColorway(cwIdx)}
                            className="text-xs text-zinc-400 hover:text-red-600 flex items-center gap-1 font-medium transition-colors px-2 py-1"
                            title="Remove this entire colourway"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 1. Colour Name & Swatch Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 border border-zinc-200">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-700 mb-1">
                          Colour Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={cw.color_name}
                          onChange={(e) => handleUpdateColorway(cwIdx, 'color_name', e.target.value)}
                          placeholder="e.g. Midnight Black, Heather Grey"
                          className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-300 font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-700 mb-1">
                          HEX Colour Swatch
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={cw.color_hex}
                            onChange={(e) => handleUpdateColorway(cwIdx, 'color_hex', e.target.value)}
                            className="w-8 h-8 p-0 border border-zinc-300 cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={cw.color_hex}
                            onChange={(e) => handleUpdateColorway(cwIdx, 'color_hex', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs font-mono uppercase bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Quick color preset chips */}
                      <div className="sm:col-span-2 pt-1 border-t border-zinc-100">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
                          Quick Presets:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {COLOR_PRESETS.map((p) => (
                            <button
                              type="button"
                              key={p.name}
                              onClick={() => {
                                handleUpdateColorway(cwIdx, 'color_name', p.name);
                                handleUpdateColorway(cwIdx, 'color_hex', p.hex);
                              }}
                              className="px-2 py-0.5 text-[10px] bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 flex items-center gap-1 transition-colors"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-zinc-400"
                                style={{ backgroundColor: p.hex }}
                              />
                              <span>{p.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 2. DEDICATED IMAGE SECTION FOR THIS COLOURWAY */}
                    <div className="bg-white p-4 border border-zinc-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 pb-2">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-black flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-black" />
                          Photos for {cw.color_name || `Colourway #${cwIdx + 1}`}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Front view, back view &amp; detail shots · Uploads directly to Cloudflare R2
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        {/* 1. MAIN FRONT PHOTO */}
                        <div className="border border-zinc-200 p-3 bg-zinc-50 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-black">
                              Main Front Photo *
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-black text-white font-mono uppercase">
                              Catalog View
                            </span>
                          </div>

                          <div className="relative w-full aspect-3/4 max-w-[200px] mx-auto bg-zinc-200 border border-zinc-300 overflow-hidden group">
                            {uploadingTarget === `cw_${cwIdx}_image_url` ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-black/85 text-white gap-2 p-2 text-center">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span className="text-[10px] uppercase font-bold tracking-wider">
                                  Uploading to R2...
                                </span>
                              </div>
                            ) : cw.image_url ? (
                              <>
                                <Image src={cw.image_url} alt="" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 p-2 transition-opacity">
                                  <label className="cursor-pointer text-[10px] uppercase font-bold tracking-wider bg-white text-black px-2.5 py-1 hover:bg-zinc-100">
                                    Change Photo
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleR2Upload(e, cwIdx, 'image_url')}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateColorway(cwIdx, 'image_url', '')}
                                    className="text-[10px] text-red-300 hover:text-red-100 underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label className="w-full h-full flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-zinc-100 transition-colors text-center border-2 border-dashed border-zinc-300">
                                <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                                <span className="px-3 py-1 bg-black text-white text-[10px] uppercase font-bold tracking-wider mb-1">
                                  + Add Main Photo
                                </span>
                                <span className="text-[9px] text-zinc-500">Cloudflare R2</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleR2Upload(e, cwIdx, 'image_url')}
                                />
                              </label>
                            )}
                          </div>

                          {/* Fallback direct URL */}
                          <div className="pt-1">
                            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">
                              Or Image URL:
                            </label>
                            <input
                              type="text"
                              value={cw.image_url}
                              onChange={(e) => handleUpdateColorway(cwIdx, 'image_url', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-2 py-1 text-[11px] bg-white border border-zinc-300 font-mono"
                            />
                          </div>
                        </div>

                        {/* 2. BACK / HOVER PHOTO */}
                        <div className="border border-zinc-200 p-3 bg-zinc-50 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-black">
                              Back / Hover Photo
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-zinc-200 text-zinc-700 font-mono uppercase">
                              Flip on Hover
                            </span>
                          </div>

                          <div className="relative w-full aspect-3/4 max-w-[200px] mx-auto bg-zinc-200 border border-zinc-300 overflow-hidden group">
                            {uploadingTarget === `cw_${cwIdx}_secondary_image_url` ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-black/85 text-white gap-2 p-2 text-center">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span className="text-[10px] uppercase font-bold tracking-wider">
                                  Uploading to R2...
                                </span>
                              </div>
                            ) : cw.secondary_image_url ? (
                              <>
                                <Image src={cw.secondary_image_url} alt="" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 p-2 transition-opacity">
                                  <label className="cursor-pointer text-[10px] uppercase font-bold tracking-wider bg-white text-black px-2.5 py-1 hover:bg-zinc-100">
                                    Change Photo
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleR2Upload(e, cwIdx, 'secondary_image_url')}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateColorway(cwIdx, 'secondary_image_url', '')}
                                    className="text-[10px] text-red-300 hover:text-red-100 underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label className="w-full h-full flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-zinc-100 transition-colors text-center border-2 border-dashed border-zinc-300">
                                <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                                <span className="px-3 py-1 bg-zinc-800 text-white text-[10px] uppercase font-bold tracking-wider mb-1">
                                  + Add Back Photo
                                </span>
                                <span className="text-[9px] text-zinc-500">Shop Catalog Hover</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleR2Upload(e, cwIdx, 'secondary_image_url')}
                                />
                              </label>
                            )}
                          </div>

                          {/* Fallback direct URL */}
                          <div className="pt-1">
                            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">
                              Or Back Image URL:
                            </label>
                            <input
                              type="text"
                              value={cw.secondary_image_url || ''}
                              onChange={(e) => handleUpdateColorway(cwIdx, 'secondary_image_url', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-2 py-1 text-[11px] bg-white border border-zinc-300 font-mono"
                            />
                          </div>
                        </div>

                        {/* 3. EXTRA GALLERY ANGLES */}
                        <div className="border border-zinc-200 p-3 bg-zinc-50 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-black">
                              Extra Gallery Angles
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-zinc-200 text-zinc-700 font-mono uppercase">
                              {(cw.gallery_images || []).length} Photo{(cw.gallery_images || []).length === 1 ? '' : 's'}
                            </span>
                          </div>

                          {/* Upload button for gallery */}
                          <label className="w-full p-2.5 bg-white border border-dashed border-zinc-300 hover:border-black flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                            {uploadingTarget === `cw_${cwIdx}_gallery` ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-black">
                                  Uploading Angle...
                                </span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-black" />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-black">
                                  + Add Angle Photo
                                </span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleR2Upload(e, cwIdx, 'gallery')}
                            />
                          </label>

                          {/* Thumbnails grid */}
                          {(cw.gallery_images || []).length > 0 ? (
                            <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto p-1 bg-white border border-zinc-200">
                              {(cw.gallery_images || []).map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="relative aspect-square bg-zinc-100 group border border-zinc-200">
                                  <Image src={imgUrl} alt="" fill className="object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(cwIdx, imgIdx)}
                                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                                    title="Remove angle"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 text-center bg-white border border-zinc-200 text-[10px] text-zinc-400">
                              No additional angle photos added yet.
                            </div>
                          )}

                          {/* Direct URL adder */}
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={cw.galleryUrlInput || ''}
                              onChange={(e) => handleUpdateColorway(cwIdx, 'galleryUrlInput', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddGalleryUrl(cwIdx, cw.galleryUrlInput || '');
                                }
                              }}
                              placeholder="Or paste angle URL..."
                              className="w-full px-2 py-1 text-[11px] bg-white border border-zinc-300 font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddGalleryUrl(cwIdx, cw.galleryUrlInput || '')}
                              className="px-2 py-1 text-[10px] uppercase font-bold bg-zinc-800 text-white hover:bg-black shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. SIZE SELECTION & STOCK INVENTORY */}
                    <div className="space-y-4">

                        {/* Size Selection (Which sizes exist for this colour?) */}
                        <div className="bg-white p-3.5 border border-zinc-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider font-bold text-black block">
                                Which Sizes Are Available?
                              </span>
                              <span className="text-[11px] text-zinc-500">
                                Click a size to add or remove it from this colourway.
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSelectAllSizesForColorway(cwIdx)}
                                className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold border border-zinc-300 hover:bg-zinc-100 text-zinc-700"
                              >
                                Select All
                              </button>
                            </div>
                          </div>

                          {/* Size Pills Toggle */}
                          <div className="flex flex-wrap gap-2">
                            {cw.sizes.map((s) => (
                              <button
                                type="button"
                                key={s.size}
                                onClick={() => handleToggleSize(cwIdx, s.size)}
                                className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                                  s.enabled
                                    ? 'bg-black text-white border-black shadow-xs'
                                    : 'bg-zinc-50 text-zinc-400 border-zinc-200 hover:border-zinc-400 hover:text-black'
                                }`}
                              >
                                <span>{s.size}</span>
                                {s.enabled ? (
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                ) : (
                                  <Plus className="w-3 h-3 text-zinc-300" />
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Add Custom Size Form */}
                          <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                            <input
                              type="text"
                              value={cw.customSizeInput || ''}
                              onChange={(e) => handleUpdateColorway(cwIdx, 'customSizeInput', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomSize(cwIdx, cw.customSizeInput || '');
                                  handleUpdateColorway(cwIdx, 'customSizeInput', '');
                                }
                              }}
                              placeholder="Add custom size (e.g. XS, Free Size, 28, 30)..."
                              className="px-2.5 py-1 text-xs bg-zinc-50 border border-zinc-300 w-64"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                handleAddCustomSize(cwIdx, cw.customSizeInput || '');
                                handleUpdateColorway(cwIdx, 'customSizeInput', '');
                              }}
                              className="px-2.5 py-1 text-xs bg-zinc-100 border border-zinc-300 hover:bg-zinc-200 text-black font-semibold uppercase tracking-wider"
                            >
                              + Add Size
                            </button>
                          </div>
                        </div>

                        {/* REAL-TIME STOCK PER SIZE TABLE ("how much for S and how much for M") */}
                        {activeSizes.length > 0 ? (
                          <div className="bg-white border border-zinc-200 overflow-hidden shadow-xs">
                            <div className="bg-zinc-100 px-3.5 py-2 border-b border-zinc-200 flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-black flex items-center gap-1.5">
                                <Boxes className="w-3.5 h-3.5" /> Stock Quantity Per Selected Size
                              </span>

                              {/* Quick Bulk Stock Fill */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-zinc-500">Set all to:</span>
                                <input
                                  type="number"
                                  min="0"
                                  defaultValue={15}
                                  id={`bulk_stock_${cwIdx}`}
                                  className="w-12 px-1.5 py-0.5 text-xs text-center border border-zinc-300 bg-white font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const inputEl = document.getElementById(
                                      `bulk_stock_${cwIdx}`
                                    ) as HTMLInputElement | null;
                                    const val = inputEl ? Number(inputEl.value) : 15;
                                    handleSetAllStockForColorway(cwIdx, val);
                                  }}
                                  className="px-2 py-0.5 text-[10px] uppercase font-bold bg-black text-white hover:bg-zinc-800"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>

                            <table className="w-full text-left text-xs">
                              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[9px] border-b border-zinc-200">
                                <tr>
                                  <th className="py-2 px-3 font-bold w-16">Size</th>
                                  <th className="py-2 px-3 font-bold">Stock Units (In-Stock Quantity)</th>
                                  <th className="py-2 px-3 font-bold">SKU Identifier</th>
                                  <th className="py-2 px-3 font-bold text-right w-10">Remove</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100">
                                {activeSizes.map((s) => (
                                  <tr key={s.size} className="hover:bg-zinc-50 transition-colors">
                                    <td className="py-2 px-3 font-mono font-bold text-black text-sm">
                                      <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300">
                                        {s.size}
                                      </span>
                                    </td>

                                    {/* Stock Input with - and + buttons */}
                                    <td className="py-2 px-3">
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateSizeStock(cwIdx, s.size, s.stock - 1)
                                          }
                                          disabled={s.stock <= 0}
                                          className="w-6 h-6 flex items-center justify-center border border-zinc-300 hover:border-black text-black disabled:opacity-30 bg-zinc-50"
                                          title="Decrease 1"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <input
                                          type="number"
                                          min="0"
                                          value={s.stock}
                                          onChange={(e) =>
                                            handleUpdateSizeStock(
                                              cwIdx,
                                              s.size,
                                              Number(e.target.value)
                                            )
                                          }
                                          className="w-16 px-2 py-1 text-xs text-center font-bold bg-white border border-zinc-300 focus:outline-none focus:border-black"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateSizeStock(cwIdx, s.size, s.stock + 1)
                                          }
                                          className="w-6 h-6 flex items-center justify-center border border-zinc-300 hover:border-black text-black bg-zinc-50"
                                          title="Increase 1"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                        <span className="text-[11px] text-zinc-500 ml-1">pieces</span>
                                      </div>
                                    </td>

                                    {/* SKU */}
                                    <td className="py-2 px-3 font-mono">
                                      <input
                                        type="text"
                                        value={s.sku}
                                        onChange={(e) =>
                                          handleUpdateSizeSku(cwIdx, s.size, e.target.value)
                                        }
                                        className="w-full max-w-[200px] px-2 py-1 text-[11px] bg-white border border-zinc-300"
                                      />
                                    </td>

                                    {/* Remove this size button */}
                                    <td className="py-2 px-3 text-right">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleSize(cwIdx, s.size)}
                                        className="text-zinc-400 hover:text-red-600 p-1"
                                        title={`Remove size ${s.size}`}
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-4 bg-zinc-100 border border-dashed border-zinc-300 text-center text-xs text-zinc-500">
                            No sizes selected for this colour. Click the size buttons above to add S, M, L, etc.
                          </div>
                        )}
                      </div>
                    </div>
                  );
              })}
            </div>

            {/* Add Another Colour / Style Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleAddColorway()}
                className="w-full py-3.5 border-2 border-dashed border-zinc-300 hover:border-black bg-white hover:bg-zinc-50 text-black text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 stroke-[2]" /> Add Another Colour / Style (e.g. White, Grey, Olive, Navy, Red)
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pricing, Status Badges & R2 Helper */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-sans text-base font-bold text-black border-b border-zinc-100 pb-2">
              Privilege Pricing (INR)
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-zinc-500 font-serif">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1999"
                  className="w-full pl-8 pr-3 py-2 text-sm font-semibold bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                Compare At Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-zinc-500 font-serif">₹</span>
                <input
                  type="number"
                  min="0"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="2499"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Displayed as struck-through original price
              </p>
            </div>
          </div>

          {/* Badges & Flags */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-sans text-base font-bold text-black border-b border-zinc-100 pb-2">
              Curated Tags & Highlights
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-black border-zinc-300 rounded-none focus:ring-0"
                />
                <div>
                  <span className="font-semibold block">Featured Curated Highlight</span>
                  <span className="text-[11px] text-zinc-500">Showcases on prime homepage carousel</span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 text-black border-zinc-300 rounded-none focus:ring-0"
                />
                <div>
                  <span className="font-semibold block">New Arrival Collection</span>
                  <span className="text-[11px] text-zinc-500">Displays contemporary seasonal badge</span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="w-4 h-4 text-black border-zinc-300 rounded-none focus:ring-0"
                />
                <div>
                  <span className="font-semibold block">Patron Bestseller</span>
                  <span className="text-[11px] text-zinc-500">Highlights highest rated piece</span>
                </div>
              </label>
            </div>
          </div>

          {/* Cloudflare R2 Quick Upload Helper */}
          <div className="bg-zinc-50 p-6 border border-zinc-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-black text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Cloudflare R2 Storage
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Upload ultra high-resolution photography directly to your R2 object bucket with automatic CDN distribution.
            </p>

            <label className="block w-full py-2.5 px-4 bg-white border border-zinc-300 text-center text-xs uppercase tracking-widest font-semibold hover:border-black cursor-pointer transition-colors">
              {uploadingImage ? 'Transmitting to R2...' : 'Select File for R2'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingImage}
                onChange={(e) => handleR2Upload(e)}
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
