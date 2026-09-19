'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  BellRing,
  X
} from 'lucide-react';
import { SocialProofNotification } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminSocialProofPage() {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState<SocialProofNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<SocialProofNotification | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [timeAgo, setTimeAgo] = useState('2 minutes ago');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/social-proof');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        error('Error', data.message || 'Failed to fetch notifications');
      }
    } catch {
      error('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openCreateModal = () => {
    setEditingNotification(null);
    setCustomerName('');
    setCity('Mumbai');
    setProductTitle('');
    setProductImageUrl('https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_11.png');
    setTimeAgo('Just now');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: SocialProofNotification) => {
    setEditingNotification(item);
    setCustomerName(item.customer_name || '');
    setCity(item.city || '');
    setProductTitle(item.product_title || '');
    setProductImageUrl(item.product_image_url || item.product_image || '');
    setTimeAgo(item.time_ago || '');
    setIsActive(Boolean(item.is_active));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !productTitle.trim()) {
      error('Validation', 'Customer Name and Product Title are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<SocialProofNotification> = {
        id: editingNotification?.id,
        customer_name: customerName.trim(),
        city: city.trim(),
        product_title: productTitle.trim(),
        product_image_url: productImageUrl.trim(),
        time_ago: timeAgo.trim(),
        is_active: isActive,
      };

      const res = await fetch('/api/admin/social-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success('Success', editingNotification ? 'Alert updated' : 'Alert created');
        setIsModalOpen(false);
        fetchNotifications();
      } else {
        error('Error', data.message || 'Failed to save');
      }
    } catch {
      error('Error', 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social proof alert?')) return;

    try {
      const res = await fetch(`/api/admin/social-proof?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        success('Deleted', 'Social proof alert removed');
        fetchNotifications();
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
            Conversion Optimizations
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-black font-sans mt-0.5">
            Social Proof Order Alerts
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time simulated order popup toasts displayed in the bottom-left corner to boost visitor trust and conversions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
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
            <span>Add Alert</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-400 uppercase tracking-widest">
          Loading Alerts...
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center bg-white border border-zinc-200 p-8">
          <BellRing className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-black">No Social Proof Alerts</p>
          <p className="text-xs text-zinc-500 mt-1 mb-4">
            Create alerts showing recent purchases from Delhi, Mumbai, Bengaluru, etc.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold"
          >
            Create First Alert
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 bg-white border ${
                item.is_active ? 'border-zinc-200' : 'border-dashed border-zinc-300 opacity-60'
              } shadow-sm flex flex-col justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                  <Image
                    src={item.product_image_url || 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/B_11.png'}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-black truncate">{item.customer_name}</p>
                    <span className="text-[10px] text-zinc-400">{item.time_ago}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate">from {item.city}</p>
                  <p className="text-xs font-medium text-zinc-900 truncate">
                    Purchased: {item.product_title}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 mt-3 flex items-center justify-between text-xs">
                <span
                  className={`px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold ${
                    item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {item.is_active ? 'Active' : 'Off'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-zinc-700 hover:text-black uppercase tracking-wider font-semibold"
                  >
                    Edit
                  </button>
                  <span className="text-zinc-300">•</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-rose-600 hover:text-rose-800 uppercase tracking-wider font-semibold"
                  >
                    Delete
                  </button>
                </div>
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
                {editingNotification ? 'Edit Social Proof Alert' : 'New Social Proof Alert'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aryan S."
                    required
                    className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    City / State *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, MH"
                    required
                    className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="e.g. Vintage Heavyweight Graphic Hoodie"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Product Thumbnail Image URL *
                </label>
                <input
                  type="url"
                  value={productImageUrl}
                  onChange={(e) => setProductImageUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                    Relative Time Display
                  </label>
                  <input
                    type="text"
                    value={timeAgo}
                    onChange={(e) => setTimeAgo(e.target.value)}
                    placeholder="e.g. 4 minutes ago"
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
                  <span>Save Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
