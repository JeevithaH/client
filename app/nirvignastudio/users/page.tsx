'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Ban, CheckCircle2, ShoppingBag, X, Calendar } from 'lucide-react';
import { User, Order } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminUsersPage() {
  const { success, error } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // User orders drawer
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: 'active' | 'banned') => {
    const nextStatus = currentStatus === 'active' ? 'banned' : 'active';
    setUpdatingId(userId);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: nextStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );
        success('Patron Status Updated', `Account is now ${nextStatus}.`);
      } else {
        error('Update Failed', data.message);
      }
    } catch {
      error('Error', 'Could not update patron status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewOrders = async (user: User) => {
    setSelectedUser(user);
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/admin/users?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setUserOrders(data.orders || []);
      }
    } catch {
      error('Error', 'Failed to retrieve patron order history');
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Client Registry
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
            Registered Patrons & Privileges
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-zinc-200 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Patron Name or Email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Patron Details</th>
                <th className="py-3.5 px-6 font-bold">Role</th>
                <th className="py-3.5 px-6 font-bold">Registration Date</th>
                <th className="py-3.5 px-6 font-bold">Orders Executed</th>
                <th className="py-3.5 px-6 font-bold">Lifetime Spend</th>
                <th className="py-3.5 px-6 font-bold">Account Status</th>
                <th className="py-3.5 px-6 font-bold text-right">Sanctions & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    Querying patron records from Cloudflare D1...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <Users className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-medium text-base text-zinc-700">No patrons match the inquiry</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isBanned = u.status === 'banned';

                  return (
                    <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-black text-sm">{u.name}</p>
                        <p className="text-[11px] text-zinc-500">{u.email}</p>
                        {u.phone && <p className="text-[10px] text-zinc-400">{u.phone}</p>}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${
                            u.role === 'admin'
                              ? 'bg-black text-white border-black'
                              : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                          }`}
                        >
                          {u.role === 'admin' ? 'Director' : 'Patron'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-zinc-600">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Seeded Archive'}
                      </td>

                      <td className="py-4 px-6 font-semibold text-black">
                        <button
                          onClick={() => handleViewOrders(u)}
                          className="hover:text-zinc-600 transition-colors text-black flex items-center gap-1 font-mono"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-black" />
                          {u.orders_count || 0} orders
                        </button>
                      </td>

                      <td className="py-4 px-6 font-bold text-black">
                        ₹{(u.total_spent || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${
                            isBanned
                              ? 'bg-zinc-900 text-white border-black'
                              : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                          }`}
                        >
                          {isBanned ? (
                            <>
                              <Ban className="w-3 h-3 text-white" /> Banned
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-black" /> Active
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {u.role !== 'admin' && (
                          <button
                            disabled={updatingId === u.id}
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold border transition-all ${
                              isBanned
                                ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                                : 'border-rose-300 text-rose-700 hover:bg-rose-50'
                            }`}
                          >
                            {isBanned ? 'Reinstate Patron' : 'Ban Account'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patron Order History Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  Patron Order Dossier
                </span>
                <h3 className="font-sans text-lg font-bold text-black">
                  {selectedUser.name} ({selectedUser.email})
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-zinc-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-zinc-400">
                Loading order portfolio...
              </div>
            ) : userOrders.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                <p className="font-medium text-base text-zinc-700">No orders placed by this patron yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((ord) => (
                  <div key={ord.id} className="p-4 border border-zinc-200 bg-zinc-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-black">{ord.order_number}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-white border border-zinc-300 text-black">
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-600">
                      <span>Date: {new Date(ord.created_at).toLocaleDateString('en-IN')}</span>
                      <span className="font-bold text-black text-sm">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 flex flex-wrap gap-2 text-[11px] text-zinc-700">
                      {ord.items?.map((it) => (
                        <span key={it.id} className="bg-white px-2 py-0.5 border border-zinc-200">
                          {it.product_title} ({it.size}, {it.color_name}) × {it.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
