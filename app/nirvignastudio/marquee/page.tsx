'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Repeat,
  X
} from 'lucide-react';
import { MarqueeItem } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminMarqueePage() {
  const { success, error } = useToast();
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarqueeItem | null>(null);

  // Form State
  const [text, setText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/marquee');
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      } else {
        error('Error', data.message || 'Failed to fetch marquee items');
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

  const openCreateModal = () => {
    setEditingItem(null);
    setText('');
    setLinkUrl('');
    setDisplayOrder(items.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MarqueeItem) => {
    setEditingItem(item);
    setText(item.text);
    setLinkUrl(item.link_url || '');
    setDisplayOrder(item.display_order);
    setIsActive(Boolean(item.is_active));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      error('Validation', 'Text is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<MarqueeItem> = {
        id: editingItem?.id,
        text: text.trim(),
        link_url: linkUrl.trim() || undefined,
        display_order: Number(displayOrder),
        is_active: isActive,
      };

      const res = await fetch('/api/admin/marquee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success('Success', editingItem ? 'Marquee item updated' : 'Marquee item created');
        setIsModalOpen(false);
        fetchItems();
      } else {
        error('Error', data.message || 'Failed to save marquee item');
      }
    } catch {
      error('Error', 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this marquee phrase?')) return;

    try {
      const res = await fetch(`/api/admin/marquee?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        success('Deleted', 'Marquee item deleted');
        fetchItems();
      } else {
        error('Error', data.message || 'Failed to delete');
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
            Homepage Ribbon
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-black font-sans mt-0.5">
            Marquee Ticker Ribbons
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Dynamic continuously-scrolling brand and sale slogans displayed across the home page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchItems}
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
            <span>Add Slogan</span>
          </button>
        </div>
      </div>

      {/* Items List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-400 uppercase tracking-widest">
          Loading Marquee...
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center bg-white border border-zinc-200 p-8">
          <Repeat className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-black">No Marquee Phrases Active</p>
          <p className="text-xs text-zinc-500 mt-1 mb-4">
            Add slogans like &apos;STITCHCLOTHES STREETWEAR&apos; or &apos;WORLDWIDE EXPRESS SHIPPING&apos;.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold"
          >
            Create First Slogan
          </button>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 shadow-sm divide-y divide-zinc-200">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold font-mono text-zinc-700 shrink-0">
                  #{item.display_order}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold uppercase tracking-wider text-black">{item.text}</p>
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold ${
                        item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  {item.link_url && (
                    <div className="text-xs text-zinc-500">
                      Link: <span className="font-mono text-black">{item.link_url}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:self-center shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-800 hover:text-black uppercase tracking-wider px-3 py-1.5 border border-zinc-300 hover:border-black transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 uppercase tracking-wider px-3 py-1.5 border border-rose-200 hover:border-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-zinc-300 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h2 className="text-base font-bold uppercase tracking-wider text-black">
                {editingItem ? 'Edit Slogan' : 'New Slogan'}
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
                  Slogan Phrase *
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. EXTRA 10% OFF ON ORDERS ABOVE ₹999"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Optional Link
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="/collections/all"
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
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
                      Active
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
                  <span>{editingItem ? 'Update' : 'Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
