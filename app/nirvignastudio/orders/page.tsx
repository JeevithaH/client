'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Truck,
  PackageCheck,
  Clock,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/toast-context';

export default function AdminOrdersPage() {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    // Optimistic UI update: immediately show the new status in table & modal
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success('Status Advanced', `Order is now marked as ${newStatus}.`);
        fetchOrders();
      } else {
        error('Update Failed', data.message);
        fetchOrders(); // Rollback to actual state
      }
    } catch {
      error('Error', 'Could not update status');
      fetchOrders(); // Rollback
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return {
          label: 'Placed',
          color: 'bg-zinc-100 text-zinc-900 border-zinc-300',
          icon: Clock,
        };
      case 'Confirmed':
        return {
          label: 'Confirmed',
          color: 'bg-zinc-200 text-zinc-900 border-zinc-400 font-semibold',
          icon: CheckCircle,
        };
      case 'Shipped':
        return {
          label: 'Shipped',
          color: 'bg-zinc-900 text-white border-black',
          icon: Truck,
        };
      case 'Delivered':
        return {
          label: 'Delivered',
          color: 'bg-black text-white border-black',
          icon: PackageCheck,
        };
      default:
        return {
          label: status,
          color: 'bg-zinc-100 text-zinc-800 border-zinc-200',
          icon: Clock,
        };
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Order Fulfillment
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
            Client Order Ledger
          </h1>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-zinc-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Patron Name, or Email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 py-2 px-3 text-xs bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black"
        >
          <option value="all">All Delivery States</option>
          <option value="Placed">Placed</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Order Number</th>
                <th className="py-3.5 px-6 font-bold">Patron Details</th>
                <th className="py-3.5 px-6 font-bold">Order Date</th>
                <th className="py-3.5 px-6 font-bold">Items</th>
                <th className="py-3.5 px-6 font-bold">Total</th>
                <th className="py-3.5 px-6 font-bold">Fulfillment Status</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    Loading order history...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-medium text-base text-zinc-700">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const Icon = badge.icon;

                  return (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-black">
                        {order.order_number}
                        {order.coupon_code && (
                          <span className="block text-[10px] text-zinc-600 font-sans font-medium">
                            Coupon: {order.coupon_code}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-medium text-black">{order.customer_name}</p>
                        <p className="text-[11px] text-zinc-500">{order.customer_email}</p>
                        <p className="text-[10px] text-zinc-400">{order.customer_phone}</p>
                      </td>

                      <td className="py-4 px-6 text-zinc-600">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </td>

                      <td className="py-4 px-6 text-zinc-700 font-medium">
                        {order.items?.length || 1} garment{order.items && order.items.length > 1 ? 's' : ''}
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-black text-sm">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] text-zinc-600 font-medium">
                          {order.payment_method || 'Razorpay Paid'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border ${badge.color}`}
                          >
                            <Icon className="w-3 h-3" />
                            {badge.label}
                          </span>

                          <select
                            disabled={updatingId === order.id}
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="text-xs bg-white border border-zinc-300 py-1 px-1.5 focus:outline-none focus:border-black"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="View Order Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  Order Dossier
                </span>
                <h3 className="font-sans text-xl font-bold text-black">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-50 border border-zinc-200 text-xs">
              <div className="space-y-1.5">
                <p className="font-bold text-black flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-black" /> Patron Details
                </p>
                <p className="font-medium text-black">{selectedOrder.customer_name}</p>
                <p className="text-zinc-600 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-zinc-400" /> {selectedOrder.customer_email}
                </p>
                <p className="text-zinc-600 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-zinc-400" /> {selectedOrder.customer_phone}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-black flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-black" /> Destination Address
                </p>
                {typeof selectedOrder.shipping_address === 'object' ? (
                  <p className="text-zinc-700 leading-relaxed">
                    {selectedOrder.shipping_address.street}
                    {selectedOrder.shipping_address.apartment && `, ${selectedOrder.shipping_address.apartment}`}
                    <br />
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} -{' '}
                    {selectedOrder.shipping_address.postal_code}
                  </p>
                ) : (
                  <p className="text-zinc-700">{selectedOrder.shipping_address}</p>
                )}
              </div>
            </div>

            {/* Garments Ordered */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-black mb-3">
                Tailored Garments
              </h4>
              <div className="divide-y divide-zinc-100 border border-zinc-200">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                        <Image src={item.image_url} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-black text-xs">
                          {item.product_title}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Color: {item.color_name} • Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black text-xs">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-zinc-400">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Reconciliation */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrder.discount_amount > 0 && (
                <div className="flex justify-between text-black font-semibold">
                  <span>Privilege Savings ({selectedOrder.coupon_code})</span>
                  <span>-₹{selectedOrder.discount_amount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                <span>
                  {selectedOrder.shipping_fee === 0 ? 'Complimentary' : `₹${selectedOrder.shipping_fee}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-300 font-bold text-black text-sm">
                <span>Gross Settled</span>
                <span>₹{selectedOrder.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick Status Advance in Modal */}
            <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
              <span className="text-xs text-zinc-500">
                Payment: <strong className="text-black">{selectedOrder.payment_status}</strong> (
                {selectedOrder.razorpay_payment_id || 'Mock Test'})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-black">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="text-xs bg-white border border-zinc-300 py-1.5 px-2 focus:outline-none focus:border-black"
                >
                  <option value="Placed">Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
