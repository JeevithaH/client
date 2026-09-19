'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Store,
  Phone,
  Mail,
  Truck,
  Percent,
  Share2
} from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminSettingsPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Form states
  const [storeName, setStoreName] = useState('STITCHCLOTHES');
  const [supportEmail, setSupportEmail] = useState('the.stitchclothes@gmail.com');
  const [supportPhone, setSupportPhone] = useState('+916395463874');
  const [whatsappNumber, setWhatsappNumber] = useState('916395463874');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(499);
  const [exitIntentEnabled, setExitIntentEnabled] = useState(true);
  const [exitIntentDiscountCode, setExitIntentDiscountCode] = useState('STITCH10');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/stitchclothes');
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/stitchclothes');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-settings');
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings as SiteSettings;
        setSettings(s);
        setStoreName(s.store_name || 'STITCHCLOTHES');
        setSupportEmail(s.support_email || 'the.stitchclothes@gmail.com');
        setSupportPhone(s.support_phone || '+916395463874');
        setWhatsappNumber(s.whatsapp_number || '916395463874');
        setFreeShippingThreshold(s.free_shipping_threshold ?? 499);
        setExitIntentEnabled(Boolean(s.exit_intent_enabled));
        setExitIntentDiscountCode(s.exit_intent_discount_code || 'STITCH10');
        setInstagramUrl(s.instagram_url || 'https://instagram.com/stitchclothes');
        setFacebookUrl(s.facebook_url || 'https://facebook.com/stitchclothes');
      }
    } catch {
      error('Error', 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSingle = async (key: string, value: any) => {
    setSavingKey(key);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        success('Saved', `Setting updated`);
      } else {
        error('Error', data.message || 'Failed to save');
      }
    } catch {
      error('Error', 'Failed to save');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey('ALL');
    try {
      await Promise.all([
        saveSingle('store_name', storeName),
        saveSingle('support_email', supportEmail),
        saveSingle('support_phone', supportPhone),
        saveSingle('whatsapp_number', whatsappNumber),
        saveSingle('free_shipping_threshold', freeShippingThreshold),
        saveSingle('exit_intent_enabled', exitIntentEnabled),
        saveSingle('exit_intent_discount_code', exitIntentDiscountCode),
        saveSingle('instagram_url', instagramUrl),
        saveSingle('facebook_url', facebookUrl),
      ]);
      success('Complete', 'All storefront settings updated successfully');
    } catch {
      error('Error', 'Failed to update all settings');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            Storefront Configuration
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-black font-sans mt-0.5">
            Store &amp; Brand Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Global parameters for contact details, shipping rules, exit-intent modals, and social channels.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading}
          className="p-2 border border-zinc-300 text-zinc-700 hover:text-black hover:border-black transition-colors self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-400 uppercase tracking-widest">
          Loading Settings...
        </div>
      ) : (
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* Section 1: Store & Concierge Identity */}
          <div className="bg-white border border-zinc-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Store className="w-4 h-4 text-black" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                Brand &amp; Contact Concierge
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Brand Store Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  WhatsApp Direct Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="916395463874"
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery & Shipping Rules */}
          <div className="bg-white border border-zinc-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Truck className="w-4 h-4 text-black" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                Shipping &amp; Free Delivery
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Free Shipping Minimum Threshold (₹)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Orders equal or above this amount automatically receive Free Delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Exit Intent Pop-up */}
          <div className="bg-white border border-zinc-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Percent className="w-4 h-4 text-black" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                Exit-Intent Coupon Modal
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Exit Intent Promo Code
                </label>
                <input
                  type="text"
                  value={exitIntentDiscountCode}
                  onChange={(e) => setExitIntentDiscountCode(e.target.value)}
                  placeholder="STITCH10"
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm uppercase font-mono"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exitIntentEnabled}
                    onChange={(e) => setExitIntentEnabled(e.target.checked)}
                    className="w-4 h-4 text-black border-zinc-300 rounded-none focus:ring-black"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-black">
                    Enable Exit-Intent Modal Popup
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Social Media Links */}
          <div className="bg-white border border-zinc-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Share2 className="w-4 h-4 text-black" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                Social Media Channels
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium uppercase tracking-wider mb-1">
                  Facebook Profile URL
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 text-black focus:outline-none focus:border-black text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={Boolean(savingKey)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
            >
              {savingKey ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save All Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
