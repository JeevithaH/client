'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, X, ArrowLeft, RefreshCw, Compass } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/shop/product-card';

const COLLECTION_TITLES: Record<string, { title: string; subtitle: string }> = {
  'all': {
    title: 'All Streetwear Drops',
    subtitle: 'Browse our complete catalogue of premium anime hoodies, sweatshirts, oversized t-shirts, and tailored streetwear.',
  },
  'best-selling': {
    title: 'Best Selling Streetwear',
    subtitle: 'Our most sought-after oversized silhouettes and anime streetwear designs.',
  },
  'hot-sale': {
    title: 'Hot Sale & Special Concessions',
    subtitle: 'Limited-time drops and exclusive collector pieces with special price concessions.',
  },
  'hoodies': {
    title: 'Heavyweight Hoodies',
    subtitle: '380 GSM fleece lined hoodies featuring balaclava hoods, anime graphics, and durable stitching.',
  },
  'oversized-t-shirt': {
    title: 'Oversized T-Shirts',
    subtitle: '240 GSM combed cotton down-shoulder and drop-shoulder streetwear t-shirts.',
  },
  'polo-t-shirts': {
    title: 'Polo T-Shirts',
    subtitle: 'Engineered mercerized cotton polos for refined casual wear.',
  },
  'jeans-shirt': {
    title: 'Jeans & Denim Shirts',
    subtitle: 'Durable washed denim streetwear overshirts.',
  },
  'unique-design-clothes': {
    title: 'Unique Design Clothes',
    subtitle: 'Experimental graphics and avant-garde streetwear cuts.',
  },
};

export default function CollectionPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('recommended');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
          if (data.categories) setCategories(data.categories);
        }
      })
      .catch((err) => console.error('Error fetching collection products:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  // Filter products by collection slug
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (slug !== 'all') {
      if (slug === 'best-selling') {
        list = list.filter((p) => p.is_bestseller);
      } else if (slug === 'hot-sale') {
        list = list.filter((p) => p.compare_at_price && p.compare_at_price > p.price);
      } else {
        const targetCategory = categories.find((c) => c.slug === slug);
        list = list.filter((p) => {
          const catMatch = p.category_slug === slug || (targetCategory && p.category_id === targetCategory.id);
          const nameMatch = p.category_name?.toLowerCase().replace(/\s+/g, '-').includes(slug);
          const titleMatch = p.title.toLowerCase().includes(slug.replace(/-/g, ' '));
          return Boolean(catMatch || nameMatch || titleMatch);
        });
      }
    }

    if (selectedSize) {
      list = list.filter((p) => p.available_sizes?.includes(selectedSize));
    }

    if (sortOption === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, slug, selectedSize, sortOption]);

  const collectionInfo = COLLECTION_TITLES[slug] || {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    subtitle: `Explore our exclusive ${slug.replace(/-/g, ' ')} drop collection.`,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#FAF8F5] border-b border-zinc-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections/all" className="hover:text-black transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-black">{collectionInfo.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0E0E0E] font-sans">
            {collectionInfo.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto font-light leading-relaxed">
            {collectionInfo.subtitle}
          </p>

          <p className="text-xs text-zinc-400 font-mono pt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
          {/* Size Quick Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mr-1">
              Filter Size:
            </span>
            {['All', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz === 'All' ? null : sz)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs border ${
                  (sz === 'All' && !selectedSize) || selectedSize === sz
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:border-black'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
              Sort By:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 border border-zinc-300 text-xs font-medium text-black focus:outline-none focus:border-black bg-white"
            >
              <option value="recommended">Featured / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-black" />
            Loading Collection...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#FAF8F5] border border-zinc-200 p-8 space-y-4">
            <Compass className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold uppercase tracking-wider text-black">
              No products found in this drop
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              We are constantly restocking our heavyweight hoodies and oversized tees.
            </p>
            <div className="pt-2">
              <Link
                href="/collections/all"
                className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-semibold inline-block"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
