'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Boxes, Search, AlertTriangle, Plus, Minus, Check, RefreshCw } from 'lucide-react';
import { ProductVariant } from '@/lib/types';
import { useToast } from '@/context/toast-context';

function InventoryContent() {
  const { success, error } = useToast();
  const searchParams = useSearchParams();
  const initialLowStock = searchParams.get('lowStock') === 'true';

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(initialLowStock);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInventory = async (lowOnly: boolean = lowStockFilter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory?lowStock=${lowOnly}&t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setVariants(data.variants || []);
      }
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(lowStockFilter);
  }, [lowStockFilter]);

  const handleStockUpdate = async (variantId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingId(variantId);

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, stock: newStock }),
      });
      const data = await res.json();

      if (data.success) {
        setVariants((prev) =>
          prev.map((v) => (v.id === variantId ? { ...v, stock: newStock } : v))
        );
        success('Inventory Adjusted', `Stock adjusted to ${newStock} units.`);
      } else {
        error('Update Failed', data.message);
      }
    } catch {
      error('Error', 'Could not update stock level');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredVariants = variants.filter((v) => {
    const titleMatch = (v.product_title || '').toLowerCase().includes(search.toLowerCase());
    const skuMatch = v.sku.toLowerCase().includes(search.toLowerCase());
    const colorMatch = v.color_name.toLowerCase().includes(search.toLowerCase());
    return titleMatch || skuMatch || colorMatch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Real-Time Stock Control
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
            Inventory & Stock Matrix
          </h1>
        </div>

        <button
          onClick={() => fetchInventory(lowStockFilter)}
          disabled={loading}
          className="px-3 py-2 border border-zinc-300 hover:border-black text-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-zinc-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Garment Title, SKU, or Colourway..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black"
          />
        </div>

        <button
          onClick={() => setLowStockFilter(!lowStockFilter)}
          className={`w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-wider font-semibold border flex items-center justify-center gap-2 transition-all ${
            lowStockFilter
              ? 'bg-black border-black text-white'
              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${lowStockFilter ? 'text-white' : 'text-black'}`} />
          {lowStockFilter ? 'Showing Low Stock (≤ 10)' : 'Filter Low Stock (≤ 10)'}
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Garment & Image</th>
                <th className="py-3.5 px-6 font-bold">Colourway</th>
                <th className="py-3.5 px-6 font-bold">Size</th>
                <th className="py-3.5 px-6 font-bold">SKU Identifier</th>
                <th className="py-3.5 px-6 font-bold">Stock Status</th>
                <th className="py-3.5 px-6 font-bold text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    Querying real-time inventory from Cloudflare D1...
                  </td>
                </tr>
              ) : filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <Boxes className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-medium text-base text-zinc-700">No matching inventory items</p>
                  </td>
                </tr>
              ) : (
                filteredVariants.map((v) => {
                  const isLow = v.stock <= 10;
                  const isDepleted = v.stock === 0;

                  return (
                    <tr key={v.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                            <Image src={v.image_url} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-black line-clamp-1">
                              {v.product_title || 'Garment Model'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-inner"
                            style={{ backgroundColor: v.color_hex }}
                          />
                          <span className="font-medium text-black">{v.color_name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono font-bold text-black">
                        <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-200">
                          {v.size}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-zinc-600 text-[11px]">{v.sku}</td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-black">
                            {v.stock}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                              isDepleted
                                ? 'bg-zinc-900 text-white border-black'
                                : isLow
                                ? 'bg-zinc-200 text-black border-zinc-400 font-bold'
                                : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                            }`}
                          >
                            {isDepleted ? 'Depleted' : isLow ? 'Low Stock' : 'Ample Stock'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={updatingId === v.id || v.stock <= 0}
                            onClick={() => handleStockUpdate(v.id, v.stock, -1)}
                            className="w-7 h-7 flex items-center justify-center border border-zinc-300 hover:border-black text-black hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                            title="Decrement 1 unit"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <button
                            disabled={updatingId === v.id}
                            onClick={() => handleStockUpdate(v.id, v.stock, 5)}
                            className="px-2 h-7 flex items-center justify-center border border-zinc-300 hover:border-black text-black text-[10px] font-semibold hover:bg-zinc-100 transition-colors"
                            title="Restock 5 units"
                          >
                            +5
                          </button>

                          <button
                            disabled={updatingId === v.id}
                            onClick={() => handleStockUpdate(v.id, v.stock, 20)}
                            className="px-2 h-7 flex items-center justify-center bg-black text-white text-[10px] font-semibold hover:bg-zinc-800 transition-colors"
                            title="Restock 20 units"
                          >
                            +20
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

export default function AdminInventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-serif text-zinc-500 text-base">
          Querying stock matrix...
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
