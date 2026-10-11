'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Boxes,
  Search,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  PackageX,
  PackageCheck,
  Package,
  X,
} from 'lucide-react';
import { ProductVariant } from '@/lib/types';
import { useToast } from '@/context/toast-context';

const LOW_STOCK_LIMIT = 10;

type StockFilter = 'all' | 'in' | 'low' | 'out';

function getStatus(stock: number): { label: string; className: string; dot: string } {
  if (stock <= 0)
    return { label: 'Out of Stock', className: 'bg-black text-white border-black', dot: 'bg-white' };
  if (stock <= LOW_STOCK_LIMIT)
    return { label: 'Low Stock', className: 'bg-zinc-200 text-black border-zinc-400', dot: 'bg-black' };
  return { label: 'In Stock', className: 'bg-white text-zinc-700 border-zinc-300', dot: 'bg-zinc-400' };
}

function InventoryContent() {
  const { success, error } = useToast();
  const searchParams = useSearchParams();
  const initialFilter: StockFilter = searchParams.get('lowStock') === 'true' ? 'low' : 'all';

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>(initialFilter);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // Custom quantity typed by the admin for each variant row
  const [qtyInputs, setQtyInputs] = useState<Record<string, string>>({});

  const fetchInventory = async () => {
    setLoading(true);
    try {
      // Always load everything so the summary counts are accurate; filter on the client
      const res = await fetch(`/api/admin/inventory?lowStock=false&t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setVariants(data.variants || []);
      } else {
        error('Load Failed', data.message || 'Could not load inventory');
      }
    } catch (err) {
      console.error('Failed to load inventory', err);
      error('Error', 'Could not load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveStock = async (variant: ProductVariant, newStock: number, message: string) => {
    const safeStock = Math.max(0, Math.floor(newStock));
    setUpdatingId(variant.id);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: variant.id, stock: safeStock }),
      });
      const data = await res.json();
      if (data.success) {
        setVariants((prev) => prev.map((v) => (v.id === variant.id ? { ...v, stock: safeStock } : v)));
        setQtyInputs((prev) => ({ ...prev, [variant.id]: '' }));
        success('Stock Updated', `${message} Now ${safeStock} in stock.`);
      } else {
        error('Update Failed', data.message || 'Could not update stock');
      }
    } catch {
      error('Error', 'Could not update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const readQty = (variantId: string): number | null => {
    const raw = (qtyInputs[variantId] || '').trim();
    const n = Number(raw);
    if (!raw || !Number.isInteger(n) || n <= 0) {
      error('Invalid Quantity', 'Please enter a whole number greater than 0.');
      return null;
    }
    return n;
  };

  const handleAdd = (v: ProductVariant) => {
    const n = readQty(v.id);
    if (n !== null) saveStock(v, v.stock + n, `Added ${n}.`);
  };

  const handleRemove = (v: ProductVariant) => {
    const n = readQty(v.id);
    if (n === null) return;
    if (n > v.stock) {
      error('Not Enough Stock', `Only ${v.stock} in stock. You cannot remove ${n}.`);
      return;
    }
    saveStock(v, v.stock - n, `Removed ${n}.`);
  };

  const handleSet = (v: ProductVariant) => {
    const raw = (qtyInputs[v.id] || '').trim();
    const n = Number(raw);
    if (raw === '' || !Number.isInteger(n) || n < 0) {
      error('Invalid Quantity', 'Please enter a whole number (0 or more).');
      return;
    }
    saveStock(v, n, `Stock set to ${n}.`);
  };

  const summary = useMemo(() => {
    let units = 0;
    let low = 0;
    let out = 0;
    for (const v of variants) {
      units += Math.max(0, v.stock);
      if (v.stock <= 0) out++;
      else if (v.stock <= LOW_STOCK_LIMIT) low++;
    }
    return { total: variants.length, units, low, out, inStock: variants.length - low - out };
  }, [variants]);

  const filteredVariants = variants.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (v.product_title || '').toLowerCase().includes(q) ||
      (v.sku || '').toLowerCase().includes(q) ||
      (v.color_name || '').toLowerCase().includes(q) ||
      (v.size || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filter === 'out') return v.stock <= 0;
    if (filter === 'low') return v.stock > 0 && v.stock <= LOW_STOCK_LIMIT;
    if (filter === 'in') return v.stock > LOW_STOCK_LIMIT;
    return true;
  });

  const tabs: { key: StockFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: summary.total },
    { key: 'in', label: 'In Stock', count: summary.inStock },
    { key: 'low', label: 'Low Stock', count: summary.low },
    { key: 'out', label: 'Out of Stock', count: summary.out },
  ];

  const cards = [
    { label: 'Total Items', value: summary.total, hint: 'Product · colour · size', icon: Boxes, dark: true },
    { label: 'Units Available', value: summary.units, hint: 'Pieces ready to sell', icon: Package, dark: false },
    { label: 'Low Stock', value: summary.low, hint: `${LOW_STOCK_LIMIT} or fewer left`, icon: AlertTriangle, dark: false },
    { label: 'Out of Stock', value: summary.out, hint: 'Not available to buy', icon: PackageX, dark: false },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold">Stock Control</span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1.5">
            Inventory &amp; Stock
          </h1>
          <p className="text-xs text-zinc-500 mt-2 max-w-md leading-relaxed">
            Every row is one product in one colour and size. Use the controls to add or remove pieces.
          </p>
        </div>
        <button
          onClick={fetchInventory}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 border border-zinc-300 bg-white hover:border-black hover:bg-black hover:text-white text-black text-[11px] uppercase tracking-[0.15em] font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`p-5 border transition-shadow hover:shadow-md ${
                c.dark ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${
                    c.dark ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  {c.label}
                </span>
                <div
                  className={`w-8 h-8 flex items-center justify-center ${
                    c.dark ? 'bg-white/10 text-white' : 'bg-zinc-100 text-black'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4 tabular-nums">{loading ? '—' : c.value.toLocaleString('en-IN')}</p>
              <p className={`text-[11px] mt-1 ${c.dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{c.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar: Tabs + Search */}
      <div className="bg-white border border-zinc-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4">
          <div className="flex flex-wrap gap-1 bg-zinc-100 p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-3.5 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold transition-all flex items-center gap-2 ${
                  filter === t.key ? 'bg-black text-white shadow-sm' : 'text-zinc-600 hover:text-black'
                }`}
              >
                {t.label}
                <span
                  className={`min-w-[20px] px-1.5 py-0.5 text-[10px] tabular-nums ${
                    filter === t.key ? 'bg-white/15 text-white' : 'bg-white text-zinc-600'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, SKU, colour, size…"
              className="w-full pl-9 pr-9 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto border-t border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-[0.15em] text-[10px]">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Product</th>
                <th className="py-3.5 px-5 font-semibold">Variant</th>
                <th className="py-3.5 px-5 font-semibold">SKU</th>
                <th className="py-3.5 px-5 font-semibold">Stock</th>
                <th className="py-3.5 px-5 font-semibold text-center">Quick ±1</th>
                <th className="py-3.5 px-5 font-semibold">Bulk Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-5">
                      <div className="h-10 bg-zinc-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <PackageCheck className="w-10 h-10 text-zinc-300 mx-auto mb-3 stroke-[1.25]" />
                    <p className="font-semibold text-sm text-black">No items found</p>
                    <p className="text-xs text-zinc-500 mt-1">Try a different filter or search term.</p>
                  </td>
                </tr>
              ) : (
                filteredVariants.map((v) => {
                  const status = getStatus(v.stock);
                  const busy = updatingId === v.id;
                  return (
                    <tr key={v.id} className={`group hover:bg-zinc-50 transition-colors ${busy ? 'opacity-50' : ''}`}>
                      {/* Product */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-14 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                            {v.image_url && (
                              <Image src={v.image_url} alt="" fill sizes="44px" className="object-cover" />
                            )}
                          </div>
                          <p className="font-semibold text-black line-clamp-2 max-w-[200px] leading-snug">
                            {v.product_title || 'Product'}
                          </p>
                        </div>
                      </td>

                      {/* Variant */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full border border-zinc-300 shrink-0"
                            style={{ backgroundColor: v.color_hex }}
                          />
                          <span className="text-zinc-700">{v.color_name}</span>
                          <span className="px-2 py-0.5 border border-zinc-300 font-mono font-bold text-black text-[11px]">
                            {v.size}
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4 px-5 font-mono text-zinc-500 text-[11px]">{v.sku}</td>

                      {/* Stock */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xl text-black tabular-nums w-10">{v.stock}</span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 text-[9px] uppercase tracking-[0.12em] font-semibold border ${status.className}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                      </td>

                      {/* Quick ±1 */}
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center">
                          <div className="inline-flex border border-zinc-300">
                            <button
                              disabled={busy || v.stock <= 0}
                              onClick={() => saveStock(v, v.stock - 1, 'Removed 1.')}
                              className="w-9 h-9 flex items-center justify-center text-black hover:bg-zinc-100 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                              title="Remove 1"
                              aria-label="Remove 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => saveStock(v, v.stock + 1, 'Added 1.')}
                              className="w-9 h-9 flex items-center justify-center bg-black text-white hover:bg-zinc-800 disabled:opacity-25 transition-colors"
                              title="Add 1"
                              aria-label="Add 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Bulk Update */}
                      <td className="py-4 px-5">
                        <div className="flex items-center">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            value={qtyInputs[v.id] ?? ''}
                            onChange={(e) => setQtyInputs((prev) => ({ ...prev, [v.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAdd(v);
                            }}
                            placeholder="Qty"
                            disabled={busy}
                            className="w-16 h-9 px-2.5 text-xs text-center border border-zinc-300 border-r-0 focus:outline-none focus:border-black bg-white"
                          />
                          <button
                            disabled={busy}
                            onClick={() => handleAdd(v)}
                            className="h-9 px-3 text-[10px] uppercase tracking-[0.12em] font-semibold bg-black text-white border border-black hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                            title="Add this many to stock"
                          >
                            Add
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => handleRemove(v)}
                            className="h-9 px-3 text-[10px] uppercase tracking-[0.12em] font-semibold bg-white text-black border border-zinc-300 border-l-0 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                            title="Remove this many from stock"
                          >
                            Remove
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => handleSet(v)}
                            className="h-9 px-3 text-[10px] uppercase tracking-[0.12em] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-300 border-l-0 hover:bg-zinc-200 hover:text-black disabled:opacity-30 transition-colors"
                            title="Replace stock with exactly this number"
                          >
                            Set
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

        {!loading && filteredVariants.length > 0 && (
          <div className="px-5 py-3 border-t border-zinc-200 text-[11px] text-zinc-500 bg-zinc-50">
            Showing <b className="text-black">{filteredVariants.length}</b> of {summary.total} items
          </div>
        )}
      </div>

      {/* Help */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: '+ / −', text: 'Adds or removes a single piece instantly.' },
          { title: 'Add / Remove', text: 'Type a number (e.g. 25) and press Add or Remove to change stock by that amount.' },
          { title: 'Set', text: 'Replaces the current stock with the exact number you type — ideal after a physical count.' },
        ].map((h) => (
          <div key={h.title} className="bg-white border border-zinc-200 p-4">
            <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-black">{h.title}</p>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{h.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-zinc-400 text-xs uppercase tracking-[0.25em]">Loading inventory…</div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
