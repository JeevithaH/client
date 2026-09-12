'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import {
  User as UserIcon,
  ShoppingBag,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  Shield,
  CheckCircle2,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Order, Address } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useUser();
  const clerk = useClerk();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Address form modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPostal, setAddrPostal] = useState('');

  const isAuthLoaded = isClerkLoaded && status !== 'loading';
  const isAuthenticated = isClerkSignedIn || status === 'authenticated';

  const userId = clerkUser?.id || (session?.user as unknown as { id?: string })?.id || 'usr-demo-patron';
  const patronName = clerkUser?.fullName || session?.user?.name || 'Patron';
  const patronEmail = clerkUser?.primaryEmailAddress?.emailAddress || session?.user?.email || 'patron@shipfold.com';

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      window.location.href = '/login?callbackUrl=/account';
    }
  }, [isAuthLoaded, isAuthenticated]);

  useEffect(() => {
    async function loadAccountData() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const [ordersRes, addrRes] = await Promise.all([
          fetch(`/api/orders?userId=${encodeURIComponent(userId)}&t=${Date.now()}`, { cache: 'no-store' }),
          fetch(`/api/addresses?userId=${encodeURIComponent(userId)}&t=${Date.now()}`, { cache: 'no-store' }),
        ]);

        const ordersData = await ordersRes.json();
        const addrData = await addrRes.json();

        if (ordersData.success) setOrders(ordersData.orders || []);
        if (addrData.success) setAddresses(addrData.addresses || []);
      } catch (err) {
        console.error('Failed to load account data', err);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      loadAccountData();
    }
  }, [userId, isAuthenticated]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fullName: addrName,
          phone: addrPhone,
          street: addrStreet,
          apartment: addrApartment,
          city: addrCity,
          state: addrState,
          postalCode: addrPostal,
          isDefault: addresses.length === 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        success('Address Saved', 'Your new delivery address has been saved.');
        setAddresses([data.address, ...addresses]);
        setShowAddressModal(false);
      } else {
        error('Error', data.message);
      }
    } catch {
      error('Error', 'Failed to save address');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Patron Banner */}
        <div className="bg-[#0C1427] text-white p-8 border border-white/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1A2544] border-2 border-[#C5A880] flex items-center justify-center font-serif text-2xl font-bold text-[#C5A880]">
              {(session?.user?.name || 'Alexander')[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl text-white font-normal">{patronName}</h1>
                <span className="text-[10px] uppercase tracking-widest bg-zinc-800 text-[#C5A880] px-2.5 py-1 border border-zinc-700">
                  {(session?.user as unknown as { role?: string })?.role === 'admin' ? 'Director' : 'Patron Member'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                {patronEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(session?.user as unknown as { role?: string })?.role === 'admin' && (
              <Link
                href="/nirvignastudio"
                className="px-4 py-2 bg-[#C5A880] text-[#0C1427] text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 hover:bg-[#b89767] transition-all"
              >
                Nirvigna Studio <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={async () => {
                if (isClerkSignedIn) {
                  await clerk.signOut();
                }
                try {
                  await fetch('/api/auth/supabase/logout', { method: 'POST' });
                } catch {}
                if (session?.user) {
                  signOut({ callbackUrl: '/' });
                } else {
                  window.location.href = '/';
                }
              }}
              className="px-4 py-2 border border-zinc-600 text-zinc-300 hover:text-white hover:border-white text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-300 gap-8 text-xs uppercase tracking-[0.2em] font-medium">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'text-[#0C1427] font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-[#0C1427]'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'text-[#0C1427] font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-[#0C1427]'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'text-[#0C1427] font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-[#0C1427]'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Patron Profile</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 text-center font-serif text-zinc-500">
                Retrieving order portfolio...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 text-center border border-zinc-200 shadow-sm space-y-3">
                <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto" />
                <h3 className="font-serif text-xl text-zinc-900">No Orders Executed Yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Your distinguished garments will be archived here upon checkout.
                </p>
                <Link
                  href="/shop"
                  className="inline-block mt-4 px-6 py-2.5 bg-[#0C1427] text-[#C5A880] text-xs uppercase tracking-widest font-semibold"
                >
                  Explore The Collection
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white border border-zinc-200 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-zinc-900">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-zinc-500 ml-3">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-[#0C1427] text-[#C5A880] text-[10px] uppercase tracking-wider font-bold">
                        {order.status}
                      </span>
                      <Link
                        href={`/order/${order.id}`}
                        className="text-xs text-black font-semibold hover:text-zinc-600 transition-colors flex items-center gap-1 luxury-link"
                      >
                        <span>Track Status</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="divide-y divide-zinc-100">
                    {order.items?.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                            <Image src={item.image_url} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-serif font-medium text-xs text-zinc-900">
                              {item.product_title}
                            </p>
                            <p className="text-[10px] text-zinc-500">
                              {item.color_name} • Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif font-semibold text-xs text-zinc-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                    <span>Paid via {order.payment_method}</span>
                    <span className="font-serif text-sm font-bold text-zinc-900">
                      Total: ₹{order.total_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-500">Manage your saved destinations for expedited dispatch.</p>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-[#0C1427] text-[#C5A880] text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white p-6 border border-zinc-200 shadow-sm space-y-2 relative">
                  {addr.is_default && (
                    <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-bold bg-[#FAF8F5] border border-zinc-300 px-2 py-0.5 text-zinc-800">
                      Default Destination
                    </span>
                  )}
                  <h4 className="font-serif font-semibold text-zinc-900 text-sm">{addr.full_name}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {addr.street} {addr.apartment && `, ${addr.apartment}`}
                    <br />
                    {addr.city}, {addr.state} - {addr.postal_code}
                    <br />
                    Phone: {addr.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile Details */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 border border-zinc-200 shadow-sm max-w-xl space-y-6">
            <h3 className="font-serif text-lg font-medium text-zinc-900 border-b border-zinc-100 pb-2">
              Patron Profile Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Full Name
                </label>
                <p className="text-sm font-serif font-medium text-zinc-900 mt-0.5">
                  {patronName}
                </p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Registered Email
                </label>
                <p className="text-sm font-mono text-zinc-800 mt-0.5">
                  {patronEmail}
                </p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Membership Status
                </label>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Patron in Good Standing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <h3 className="font-serif text-lg font-medium text-zinc-900 border-b border-zinc-100 pb-2">
              Add Delivery Destination
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300"
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300"
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={addrPostal}
                  onChange={(e) => setAddrPostal(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0C1427] text-white uppercase tracking-widest text-[10px] font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
