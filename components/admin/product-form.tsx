'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Upload, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useToast } from '@/context/toast-context';
import Link from 'next/link';

interface ProductFormProps {
  initialProduct?: Product;
  isEdit?: boolean;
}

const CATEGORIES = [
  { id: 'cat-polos', name: 'Luxury Polos' },
  { id: 'cat-crew-neck', name: 'Supima Crew Necks' },
  { id: 'cat-henleys', name: 'Mercerized Henleys' },
  { id: 'cat-oversized', name: 'Modern Relaxed & Oversized' },
];

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || 'cat-crew-neck');
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

  // Variants list
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants
      : [
          {
            id: `var_${Date.now()}_1`,
            product_id: initialProduct?.id || '',
            color_name: 'Midnight Navy',
            color_hex: '#0C172D',
            size: 'M',
            stock: 20,
            sku: 'SF-NAVY-M',
            image_url:
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
          },
          {
            id: `var_${Date.now()}_2`,
            product_id: initialProduct?.id || '',
            color_name: 'Midnight Navy',
            color_hex: '#0C172D',
            size: 'L',
            stock: 15,
            sku: 'SF-NAVY-L',
            image_url:
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
          },
        ]
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      product_id: initialProduct?.id || '',
      color_name: variants[0]?.color_name || 'Chalk White',
      color_hex: variants[0]?.color_hex || '#FFFFFF',
      size: 'XL',
      stock: 15,
      sku: `SF-${slug.substring(0, 4).toUpperCase()}-XL-${Math.floor(100 + Math.random() * 899)}`,
      image_url:
        variants[0]?.image_url ||
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop',
    };
    setVariants([...variants, newVariant]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      error('Minimum Variant Required', 'A garment must possess at least one size/colour variant.');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: unknown) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // Image upload handler (R2 API)
  const handleR2Upload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        if (variantIndex !== undefined) {
          handleUpdateVariant(variantIndex, 'image_url', data.url);
        } else {
          // update all variants without an image
          setVariants(variants.map((v) => ({ ...v, image_url: data.url })));
        }
        success('R2 Storage Upload', 'Image synced to Cloudflare R2 bucket.');
      } else {
        error('Upload Failed', data.message);
      }
    } catch {
      error('Upload Error', 'Could not transmit image to Cloudflare R2');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !categoryId) {
      error('Missing Information', 'Please complete all required garment attributes.');
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
        category_id: categoryId,
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
          `${title} is now active in the collection.`
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
        {/* Left 2 Cols: Main Attributes */}
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
                placeholder="e.g. The Sovereign Supima Crew Neck"
                className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
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
                  placeholder="sovereign-supima-crew"
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
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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

          {/* Variant Matrix & Inventory Builder */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-serif text-base font-semibold text-zinc-900">
                  Colourways, Sizes & Real-Time Stock
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Configure specific SKUs and Cloudflare R2 images per variant
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 border border-zinc-800 text-zinc-900 text-xs uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div
                  key={variant.id || idx}
                  className="p-4 border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative group"
                >
                  {/* Thumbnail / Upload */}
                  <div className="relative w-14 h-16 bg-zinc-200 shrink-0 border border-zinc-300 overflow-hidden group-hover:border-black transition-colors">
                    {variant.image_url ? (
                      <Image src={variant.image_url} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                        No image
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 cursor-pointer flex items-center justify-center text-[10px] uppercase font-bold transition-opacity">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleR2Upload(e, idx)}
                      />
                    </label>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1 w-full">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-0.5">
                        Color Name
                      </label>
                      <input
                        type="text"
                        value={variant.color_name}
                        onChange={(e) => handleUpdateVariant(idx, 'color_name', e.target.value)}
                        placeholder="Navy"
                        className="w-full px-2 py-1 text-xs bg-white border border-zinc-300"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-0.5">
                        HEX Swatch
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={variant.color_hex}
                          onChange={(e) => handleUpdateVariant(idx, 'color_hex', e.target.value)}
                          className="w-7 h-7 p-0 border border-zinc-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={variant.color_hex}
                          onChange={(e) => handleUpdateVariant(idx, 'color_hex', e.target.value)}
                          className="w-full px-1.5 py-1 text-xs font-mono bg-white border border-zinc-300 uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-0.5">
                        Size
                      </label>
                      <select
                        value={variant.size}
                        onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white border border-zinc-300"
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-0.5">
                        Stock Units
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs bg-white border border-zinc-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-0.5">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                        placeholder="SF-POLO-M"
                        className="w-full px-2 py-1 text-xs font-mono bg-white border border-zinc-300"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-zinc-400 hover:text-rose-600 p-1 self-center"
                    title="Remove variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pricing, Status Badges & Image Helper */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
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
