'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, RefreshCw, Shirt } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/shop/product-card';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
  { name: 'Navy', hex: '#0C172D' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Sand', hex: '#D7C9B8' },
  { name: 'Burgundy', hex: '#581825' },
  { name: 'Pine', hex: '#2B3D2E' },
  { name: 'Charcoal', hex: '#2D3139' },
  { name: 'Black', hex: '#151515' },
];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCat = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialFeatured = searchParams.get('featured') === 'true';
  const initialBestseller = searchParams.get('bestseller') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(4500);
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (initialSearch) {
        params.set('search', initialSearch);
      }
      if (selectedSize) {
        params.set('size', selectedSize);
      }
      if (selectedColor) {
        params.set('color', selectedColor);
      }
      if (priceRange < 4500) {
        params.set('maxPrice', priceRange.toString());
      }
      if (sortOption !== 'recommended') {
        params.set('sort', sortOption);
      }
      if (initialFeatured) {
        params.set('featured', 'true');
      }
      if (initialBestseller) {
        params.set('bestseller', 'true');
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        if (data.categories) setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to load shop products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSize, selectedColor, priceRange, sortOption, initialSearch]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedSize) count++;
    if (selectedColor) count++;
    if (priceRange < 4500) count++;
    return count;
  }, [selectedCategory, selectedSize, selectedColor, priceRange]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSize(null);
    setSelectedColor(null);
    setPriceRange(4500);
    setSortOption('recommended');
    router.push('/shop');
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen">
      {/* Editorial Header Banner */}
      <div className="border-b border-zinc-200/80 bg-[#F6F5F3] py-14 px-6 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-medium">
            Collection 2026
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#0E0E0E]">
            All T-Shirts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-light max-w-md mx-auto leading-relaxed">
            Tailored in rare American Supima® and 2-ply Egyptian cotton. Minimalist silhouettes with refined structure.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm uppercase tracking-[0.18em] font-medium text-[#0E0E0E]">
              {products.length} {products.length === 1 ? 'Item' : 'Items'}
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-zinc-500 hover:text-black uppercase tracking-wider luxury-underline ml-3"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#F6F5F3] border border-zinc-300 text-[11px] uppercase tracking-[0.2em] font-medium text-[#0E0E0E] rounded-full"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] hidden sm:inline-block">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border-b border-zinc-300 pb-1 text-[11px] uppercase tracking-[0.15em] text-[#0E0E0E] focus:outline-none focus:border-[#0E0E0E] cursor-pointer"
              >
                <option value="recommended">Featured / Curated</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Patron Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-6">
            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#0E0E0E] border-b border-zinc-200 pb-2">
                Category
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`block text-left w-full transition-colors ${
                    selectedCategory === 'all'
                      ? 'text-[#0E0E0E] font-semibold luxury-underline'
                      : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  All Silhouettes
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block text-left w-full transition-colors ${
                      selectedCategory === cat.slug
                        ? 'text-[#0E0E0E] font-semibold luxury-underline'
                        : 'text-zinc-500 hover:text-black'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#0E0E0E] border-b border-zinc-200 pb-2">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                    className={`w-8 h-8 rounded-full text-[11px] font-sans transition-all flex items-center justify-center border ${
                      selectedSize === sz
                        ? 'bg-[#0E0E0E] text-white border-[#0E0E0E]'
                        : 'bg-white border-zinc-300 text-zinc-700 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Palette */}
            <div className="space-y-3">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#0E0E0E] border-b border-zinc-200 pb-2">
                Color
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(selectedColor === c.name ? null : c.name)}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      selectedColor === c.name
                        ? 'ring-2 ring-offset-2 ring-[#0E0E0E] scale-110'
                        : 'border-zinc-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] font-medium text-[#0E0E0E] border-b border-zinc-200 pb-2">
                <span>Maximum Price</span>
                <span className="font-sans font-semibold text-xs">
                  ₹{priceRange.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1400"
                max="4500"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#0E0E0E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>₹1,400</span>
                <span>₹4,500</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-zinc-400 mb-3" />
                <p className="font-serif text-base text-zinc-700">
                  Loading the AVIVEKY Collection...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-[#F6F5F3] p-12 text-center">
                <Shirt className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-zinc-900">No Styles Found</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Try adjusting or clearing your filters to discover other signature silhouettes.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-7 py-3 rounded-full bg-[#0E0E0E] text-white text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-zinc-800"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <span className="font-sans text-xs uppercase tracking-[0.25em] font-medium">Filter & Refine</span>
              <button onClick={() => setIsMobileFilterOpen(false)} aria-label="Close filters">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-[0.25em] font-medium text-zinc-400">Categories</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setIsMobileFilterOpen(false);
                  }}
                  className="block py-1 text-left w-full text-zinc-800"
                >
                  All Silhouettes
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className="block py-1 text-left w-full text-zinc-800"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sizes */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-[0.25em] font-medium text-zinc-400">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(selectedSize === sz ? null : sz);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-8 h-8 rounded-full text-[11px] font-sans border ${
                      selectedSize === sz ? 'bg-[#0E0E0E] text-white' : 'bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3.5 rounded-full bg-[#0E0E0E] text-white text-[11px] uppercase tracking-[0.25em] font-medium"
            >
              Apply Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center font-serif text-lg text-zinc-700">
          Loading AVIVEKY Archive...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
