'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Tag,
  Boxes,
  RefreshCw,
  Truck,
} from 'lucide-react';
import { AdminDashboardMetrics, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminDashboardPage() {
  const { success, error } = useToast();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to fetch admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success('Order Updated', `Status changed to ${newStatus}`);
        fetchMetrics();
      } else {
        error('Update Failed', data.message);
      }
    } catch {
      error('Error', 'Could not update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 'bg-zinc-100 text-zinc-900 border-zinc-300';
      case 'Confirmed':
        return 'bg-zinc-200 text-zinc-900 border-zinc-400 font-semibold';
      case 'Shipped':
        return 'bg-zinc-900 text-white border-black';
      case 'Delivered':
        return 'bg-black text-white border-black';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Live Overview
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
            Director Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-3 py-2 border border-zinc-300 hover:border-black text-zinc-700 hover:text-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <Link
            href="/nirvignastudio/products/new"
            className="px-4 py-2 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Style
          </Link>
        </div>
      </div>

      {/* Low Stock Notification Alert Banner */}
      {metrics && metrics.lowStockCount > 0 && (
        <div className="p-4 bg-zinc-100 border border-zinc-300 flex items-center justify-between text-zinc-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-black shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Attention Required: Low Stock Inventory Alert
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                {metrics.lowStockCount} product variant{metrics.lowStockCount > 1 ? 's are' : ' is'} below the 10-unit threshold.
              </p>
            </div>
          </div>
          <Link
            href="/nirvignastudio/inventory?lowStock=true"
            className="text-xs font-bold luxury-underline hover:text-black uppercase tracking-widest shrink-0 ml-4"
          >
            Manage Stock →
          </Link>
        </div>
      )}

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">
              Gross Revenue
            </span>
            <div className="w-9 h-9 bg-zinc-100 text-black flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-sans text-2xl sm:text-3xl font-bold text-black">
              ₹{metrics ? metrics.totalRevenue.toLocaleString('en-IN') : '...'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
              <span className="text-black font-semibold">100% Settled</span> via Razorpay
            </p>
          </div>
        </div>

        <div className="bg-white p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">
              Orders Dispatched
            </span>
            <div className="w-9 h-9 bg-zinc-100 text-black flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-sans text-2xl sm:text-3xl font-bold text-black">
              {metrics ? metrics.totalOrders : '...'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">End-to-end tracked</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">
              Registered Patrons
            </span>
            <div className="w-9 h-9 bg-zinc-100 text-black flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-sans text-2xl sm:text-3xl font-bold text-black">
              {metrics ? metrics.totalCustomers : '...'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Verified customer accounts</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-semibold">
              Low Stock Items
            </span>
            <div className="w-9 h-9 bg-zinc-100 text-black flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-sans text-2xl sm:text-3xl font-bold text-black">
              {metrics ? metrics.lowStockCount : '...'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Variants &le; 10 units</p>
          </div>
        </div>
      </div>

      {/* Quick Access Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/nirvignastudio/products/new"
          className="p-4 bg-white border border-zinc-200 hover:border-black flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-black uppercase tracking-wider">Add New Product</p>
              <p className="text-[11px] text-zinc-500">Upload to R2 & create variants</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
        </Link>

        <Link
          href="/nirvignastudio/shipping"
          className="p-4 bg-white border border-zinc-200 hover:border-black flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-black uppercase tracking-wider">Shipping Policy</p>
              <p className="text-[11px] text-zinc-500">Free delivery & parcel fees</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
        </Link>

        <Link
          href="/nirvignastudio/coupons"
          className="p-4 bg-white border border-zinc-200 hover:border-black flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-black uppercase tracking-wider">Create Coupon</p>
              <p className="text-[11px] text-zinc-500">Set usage limits & discounts</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
        </Link>

        <Link
          href="/nirvignastudio/inventory"
          className="p-4 bg-white border border-zinc-200 hover:border-black flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-black uppercase tracking-wider">Stock Matrix</p>
              <p className="text-[11px] text-zinc-500">Real-time inventory levels</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-zinc-200 shadow-sm">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-base font-bold uppercase tracking-wider text-black">Recent Patron Orders</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Live status tracking and order progression</p>
          </div>
          <Link
            href="/nirvignastudio/orders"
            className="text-xs uppercase tracking-widest font-bold text-black hover:text-zinc-600 transition-colors luxury-link"
          >
            <span>View All Orders →</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Order ID</th>
                <th className="py-3.5 px-6 font-bold">Patron Details</th>
                <th className="py-3.5 px-6 font-bold">Items</th>
                <th className="py-3.5 px-6 font-bold">Total Amount</th>
                <th className="py-3.5 px-6 font-bold">Delivery Status</th>
                <th className="py-3.5 px-6 font-bold text-right">Quick Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Loading recent orders...
                  </td>
                </tr>
              ) : !metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    No orders placed yet. Place an order from the storefront to see live data.
                  </td>
                </tr>
              ) : (
                metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-black">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-black">{order.customer_name}</p>
                      <p className="text-[11px] text-zinc-500">{order.customer_email}</p>
                    </td>
                    <td className="py-4 px-6 text-zinc-700">
                      {order.items?.length || 1} piece{order.items && order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-4 px-6 font-bold text-black">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        disabled={updatingOrderId === order.id}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="text-xs bg-white border border-zinc-300 py-1 px-2 focus:outline-none focus:border-black"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
