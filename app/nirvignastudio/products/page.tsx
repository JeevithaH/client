'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Trash2, Edit, AlertCircle, Shirt } from 'lucide-react';
import { Product } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminProductsPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/products?t=${Date.now()}`, { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' })
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) {
        setProducts(prodData.products || []);
      }
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
    } catch (err) {
      console.error('Failed to load products or categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you certain you wish to retire '${title}' from the archive?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success('Product Retired', `${title} has been removed.`);
        fetchProducts();
      } else {
        error('Delete Failed', data.message);
      }
    } catch {
      error('Error', 'Could not delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' ||
      p.category_id === selectedCategory ||
      p.category_name?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Catalogue Management
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
            Product Archive
          </h1>
        </div>

        <Link
          href="/nirvignastudio/products/new"
          className="px-4 py-2.5 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Masterpiece
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-zinc-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, style code, or fabric..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-48 py-2 px-3 text-xs bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Style</th>
                <th className="py-3.5 px-6 font-bold">Category & Fit</th>
                <th className="py-3.5 px-6 font-bold">Retail Price</th>
                <th className="py-3.5 px-6 font-bold">Variants / Sizes</th>
                <th className="py-3.5 px-6 font-bold">Total Stock</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    Loading atelier catalogue...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <Shirt className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-medium text-base text-zinc-700">No matching garments found</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Try clearing filters or add a new garment.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const firstImage =
                    p.variants?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop';
                  const isLowStock = (p.total_stock || 0) <= 10;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                            <Image src={firstImage} alt={p.title} fill className="object-cover" />
                          </div>
                          <div>
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="font-medium text-black hover:text-zinc-600 transition-colors text-sm block line-clamp-1"
                            >
                              {p.title}
                            </Link>
                            <span className="text-[11px] text-zinc-400 font-mono">/{p.slug}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              {p.is_bestseller && (
                                <span className="bg-black text-white text-[9px] uppercase px-1.5 py-0.5 font-semibold">
                                  Bestseller
                                </span>
                              )}
                              {p.is_new && (
                                <span className="bg-zinc-200 text-black text-[9px] uppercase px-1.5 py-0.5 font-semibold">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-medium text-black">{p.category_name || 'Apparel'}</p>
                        <p className="text-[11px] text-zinc-500">{p.fit}</p>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-black text-sm">
                          ₹{p.price.toLocaleString('en-IN')}
                        </p>
                        {p.compare_at_price && (
                          <p className="text-[11px] text-zinc-400 line-through">
                            ₹{p.compare_at_price.toLocaleString('en-IN')}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.available_sizes?.map((sz) => (
                            <span
                              key={sz}
                              className="px-1.5 py-0.5 bg-zinc-100 text-zinc-700 font-mono text-[10px]"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-400 block mt-1">
                          {p.variants?.length || 0} variant combinations
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold ${
                              isLowStock ? 'text-black font-bold' : 'text-zinc-900'
                            }`}
                          >
                            {p.total_stock || 0} units
                          </span>
                          {isLowStock && (
                            <span title="Low stock">
                              <AlertCircle className="w-3.5 h-3.5 text-black" />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/nirvignastudio/products/${p.id}`}
                            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                            title="Edit Garment"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            disabled={deletingId === p.id}
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Garment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
