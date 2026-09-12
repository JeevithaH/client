/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — ORDERS & CHECKOUT ENGINE
 * ==============================================================================
 */

import { db } from './client';
import { Order, OrderItem, OrderStatus, Address } from '../types';

/**
 * Creates an order, records its items, deducts inventory, and tracks coupon usage
 * directly inside Cloudflare D1 as the primary database.
 */
export async function createOrderWithInventoryDeduction(order: {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address | string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  coupon_code?: string;
  status: OrderStatus;
  payment_status: 'Paid' | 'Pending' | 'Failed';
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  items: OrderItem[];
}): Promise<Order> {
  const addressJson =
    typeof order.shipping_address === 'string'
      ? order.shipping_address
      : JSON.stringify(order.shipping_address);

  // 1. Insert parent order
  await db
    .prepare(
      `INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, subtotal, discount_amount, shipping_fee, total_amount,
        coupon_code, status, payment_status, payment_method, razorpay_order_id, razorpay_payment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      order.id,
      order.order_number,
      order.user_id || null,
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      addressJson,
      order.subtotal,
      order.discount_amount || 0,
      order.shipping_fee || 0,
      order.total_amount,
      order.coupon_code || null,
      order.status || 'Placed',
      order.payment_status || 'Paid',
      order.payment_method || 'Razorpay',
      order.razorpay_order_id || null,
      order.razorpay_payment_id || null
    )
    .run();

  // 2. Insert line items & deduct stock
  for (const item of order.items) {
    await db
      .prepare(
        `INSERT INTO order_items (
          id, order_id, product_id, variant_id, product_title, color_name, size, price, quantity, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        item.id,
        order.id,
        item.product_id,
        item.variant_id,
        item.product_title,
        item.color_name,
        item.size,
        item.price,
        item.quantity,
        item.image_url
      )
      .run();

    await db
      .prepare('UPDATE product_variants SET stock = MAX(0, stock - ?) WHERE id = ?')
      .bind(item.quantity, item.variant_id)
      .run();
  }

  // 3. Coupon usage tracking
  if (order.coupon_code) {
    const codeUpper = order.coupon_code.toUpperCase().trim();
    await db.prepare('UPDATE coupons SET times_used = times_used + 1 WHERE UPPER(code) = ?').bind(codeUpper).run();

    if (order.user_id) {
      await db
        .prepare(
          `INSERT INTO coupon_usages (id, coupon_id, user_id, order_id, discount_amount)
           VALUES (?, (SELECT id FROM coupons WHERE UPPER(code) = ?), ?, ?, ?)`
        )
        .bind(
          `usage_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          codeUpper,
          order.user_id,
          order.id,
          order.discount_amount || 0
        )
        .run();
    }
  }

  const created = await getOrderById(order.id);
  return created as Order;
}

/**
 * Fetches an order and all its line items from Cloudflare D1.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const order = await db
    .prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?')
    .bind(id, id)
    .first<Order>();

  if (!order) return null;

  const itemRes = await db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .bind(order.id)
    .all<OrderItem>();
  const items = itemRes.results || [];

  try {
    if (typeof order.shipping_address === 'string') {
      order.shipping_address = JSON.parse(order.shipping_address);
    }
  } catch {
    // Keep raw string
  }

  return {
    ...order,
    items,
  };
}

/**
 * Retrieves all orders placed by a specific patron from Cloudflare D1.
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const res = await db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .bind(userId)
    .all<Order>();

  const orders = res.results || [];
  if (orders.length === 0) return [];

  const orderIds = orders.map((o) => o.id);
  const placeholders = orderIds.map(() => '?').join(',');
  const itemRes = await db
    .prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`)
    .bind(...orderIds)
    .all<OrderItem>();

  const itemsByOrder = new Map<string, OrderItem[]>();
  (itemRes.results || []).forEach((item) => {
    const list = itemsByOrder.get(item.order_id) || [];
    list.push(item);
    itemsByOrder.set(item.order_id, list);
  });

  return orders.map((o) => {
    try {
      if (typeof o.shipping_address === 'string') {
        o.shipping_address = JSON.parse(o.shipping_address);
      }
    } catch {
      // Keep
    }
    return {
      ...o,
      items: itemsByOrder.get(o.id) || [],
    };
  });
}

/**
 * Retrieves all orders for the Nirvigna Studio admin dashboard.
 */
export async function getAllOrdersAdmin(filters?: { status?: string; search?: string }): Promise<Order[]> {
  let query = 'SELECT * FROM orders WHERE 1=1';
  const params: unknown[] = [];

  if (filters?.status && filters.status !== 'all') {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters?.search && filters.search.trim()) {
    query += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)';
    const term = `%${filters.search.trim()}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY created_at DESC';

  const res = await db.prepare(query).bind(...params).all<Order>();
  const orders = res.results || [];

  if (orders.length === 0) return [];

  const orderIds = orders.map((o) => o.id);
  const placeholders = orderIds.map(() => '?').join(',');
  const itemRes = await db
    .prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`)
    .bind(...orderIds)
    .all<OrderItem>();

  const itemsByOrder = new Map<string, OrderItem[]>();
  (itemRes.results || []).forEach((item) => {
    const list = itemsByOrder.get(item.order_id) || [];
    list.push(item);
    itemsByOrder.set(item.order_id, list);
  });

  return orders.map((o) => {
    try {
      if (typeof o.shipping_address === 'string') {
        o.shipping_address = JSON.parse(o.shipping_address);
      }
    } catch {
      // Keep
    }
    return {
      ...o,
      items: itemsByOrder.get(o.id) || [],
    };
  });
}

/**
 * Updates an order fulfillment status directly in Cloudflare D1.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  await db
    .prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(status, orderId)
    .run();
  return true;
}
