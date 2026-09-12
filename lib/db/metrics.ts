/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — ADMIN DASHBOARD METRICS
 * ==============================================================================
 */

import { db } from './client';
import { AdminDashboardMetrics } from '../types';
import { getAllOrdersAdmin } from './orders';

/**
 * Computes high-level KPI metrics for the Nirvigna Studio dashboard from Cloudflare D1.
 */
export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const [ordersStat, customersStat, lowStockStat, allOrders] = await Promise.all([
    db
      .prepare('SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue FROM orders')
      .first<{ count: number; revenue: number }>(),
    db
      .prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'")
      .first<{ count: number }>(),
    db
      .prepare('SELECT COUNT(*) as count FROM product_variants WHERE stock <= 10')
      .first<{ count: number }>(),
    getAllOrdersAdmin(),
  ]);

  return {
    totalOrders: ordersStat?.count || 0,
    totalRevenue: ordersStat?.revenue || 0,
    totalCustomers: customersStat?.count || 0,
    lowStockCount: lowStockStat?.count || 0,
    recentOrders: allOrders.slice(0, 5),
  };
}
