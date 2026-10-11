/**
 * ==============================================================================
 * CLOUDFLARE D1 DATA ACCESS LAYER — PRODUCTS & INVENTORY
 * ==============================================================================
 */

import { db } from './client';
import { Product, ProductVariant } from '../types';
import { SEED_PRODUCTS } from '../seed-data';

interface DbProductRow {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  fabric_details: string;
  care_instructions: string;
  fit: string;
  price: number;
  compare_at_price?: number;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  is_featured: number | boolean;
  is_new: number | boolean;
  is_bestseller: number | boolean;
  rating: number;
  reviews_count: number;
  created_at?: string;
}

/**
 * Fetches garments with flexible filtering (category, search, price, size, color, sort).
 * Queries Cloudflare D1 as the primary database.
 */
export async function getAllProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  sort?: string;
  size?: string;
  color?: string;
}): Promise<Product[]> {
  try {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (filters?.category) {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(filters.category, filters.category);
    }

    if (filters?.search && filters.search.trim()) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.fabric_details LIKE ?)`;
      const searchTerm = `%${filters.search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters?.minPrice !== undefined) {
      query += ` AND p.price >= ?`;
      params.push(filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND p.price <= ?`;
      params.push(filters.maxPrice);
    }

    if (filters?.isFeatured) query += ` AND p.is_featured = 1`;
    if (filters?.isNew) query += ` AND p.is_new = 1`;
    if (filters?.isBestseller) query += ` AND p.is_bestseller = 1`;

    if (filters?.size) {
      query += ` AND p.id IN (SELECT product_id FROM product_variants WHERE size = ?)`;
      params.push(filters.size);
    }

    if (filters?.color) {
      query += ` AND p.id IN (SELECT product_id FROM product_variants WHERE LOWER(color_name) LIKE ?)`;
      params.push(`%${filters.color.toLowerCase()}%`);
    }

    switch (filters?.sort) {
      case 'price-asc':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'price-desc':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC`;
        break;
      case 'newest':
        query += ` ORDER BY p.is_new DESC, p.created_at DESC`;
        break;
      default:
        query += ` ORDER BY p.is_featured DESC, p.is_bestseller DESC, p.created_at DESC`;
    }

    const res = await db.prepare(query).bind(...params).all<DbProductRow>();
    const rows = res.results || [];

    if (rows.length === 0 && !filters?.search && !filters?.category) {
      return SEED_PRODUCTS as unknown as Product[];
    }

    // Load all variants for these products
    const productIds = rows.map((r) => r.id);
    let allVariants: ProductVariant[] = [];
    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const varRes = await db
        .prepare(`SELECT * FROM product_variants WHERE product_id IN (${placeholders})`)
        .bind(...productIds)
        .all<ProductVariant>();
      allVariants = varRes.results || [];
    }

    const variantsByProduct = new Map<string, ProductVariant[]>();
    allVariants.forEach((v) => {
      const list = variantsByProduct.get(v.product_id) || [];
      list.push(v);
      variantsByProduct.set(v.product_id, list);
    });

    return rows.map((p) => {
      const variants = variantsByProduct.get(p.id) || [];
      const colorMap = new Map<string, { name: string; hex: string; image_url: string }>();
      const sizesSet = new Set<string>();
      let totalStock = 0;

      variants.forEach((v) => {
        totalStock += v.stock;
        if (!colorMap.has(v.color_name)) {
          colorMap.set(v.color_name, {
            name: v.color_name,
            hex: v.color_hex,
            image_url: v.image_url,
          });
        }
        sizesSet.add(v.size);
      });

      return {
        ...p,
        is_featured: Boolean(p.is_featured),
        is_new: Boolean(p.is_new),
        is_bestseller: Boolean(p.is_bestseller),
        variants,
        available_colors: Array.from(colorMap.values()),
        available_sizes: Array.from(sizesSet),
        total_stock: totalStock,
      };
    });
  } catch (err) {
    console.error('[D1 getAllProducts Error]:', err);
    return SEED_PRODUCTS as unknown as Product[];
  }
}

/**
 * Retrieves a single garment by URL slug from Cloudflare D1.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await db
      .prepare(
        `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.slug = ?`
      )
      .bind(slug)
      .first<DbProductRow>();

    if (!row) {
      const fallback = (SEED_PRODUCTS as unknown as Product[]).find((p) => p.slug === slug);
      return fallback || null;
    }

    const varRes = await db
      .prepare('SELECT * FROM product_variants WHERE product_id = ?')
      .bind(row.id)
      .all<ProductVariant>();
    const variants = varRes.results || [];

    const colorMap = new Map<string, { name: string; hex: string; image_url: string }>();
    const sizesSet = new Set<string>();
    let totalStock = 0;

    variants.forEach((v) => {
      totalStock += v.stock;
      if (!colorMap.has(v.color_name)) {
        colorMap.set(v.color_name, {
          name: v.color_name,
          hex: v.color_hex,
          image_url: v.image_url,
        });
      }
      sizesSet.add(v.size);
    });

    return {
      ...row,
      is_featured: Boolean(row.is_featured),
      is_new: Boolean(row.is_new),
      is_bestseller: Boolean(row.is_bestseller),
      variants,
      available_colors: Array.from(colorMap.values()),
      available_sizes: Array.from(sizesSet),
      total_stock: totalStock,
    };
  } catch (err) {
    console.error('[D1 getProductBySlug Error]:', err);
    return (SEED_PRODUCTS as unknown as Product[]).find((p) => p.slug === slug) || null;
  }
}

/**
 * Retrieves a single garment by its primary ID from Cloudflare D1.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const row = await db
      .prepare(
        `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`
      )
      .bind(id)
      .first<DbProductRow>();

    if (!row) return null;

    const varRes = await db
      .prepare('SELECT * FROM product_variants WHERE product_id = ?')
      .bind(row.id)
      .all<ProductVariant>();
    const variants = varRes.results || [];

    return {
      ...row,
      is_featured: Boolean(row.is_featured),
      is_new: Boolean(row.is_new),
      is_bestseller: Boolean(row.is_bestseller),
      variants,
    };
  } catch (err) {
    console.error('[D1 getProductById Error]:', err);
    return null;
  }
}

/**
 * Creates or updates a garment and its variants directly in Cloudflare D1.
 */
export async function saveProductAdmin(
  productData: Product,
  variants: ProductVariant[]
): Promise<Product> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO products (
        id, title, slug, tagline, description, fabric_details, care_instructions,
        fit, price, compare_at_price, category_id, is_featured, is_new, is_bestseller, rating, reviews_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      productData.id,
      productData.title,
      productData.slug,
      productData.tagline || '',
      productData.description,
      productData.fabric_details,
      productData.care_instructions,
      productData.fit,
      productData.price,
      productData.compare_at_price || null,
      productData.category_id,
      productData.is_featured ? 1 : 0,
      productData.is_new ? 1 : 0,
      productData.is_bestseller ? 1 : 0,
      productData.rating || 4.8,
      productData.reviews_count || 0
    )
    .run();

  if (variants && variants.length > 0) {
    await db.prepare('DELETE FROM product_variants WHERE product_id = ?').bind(productData.id).run();
    for (const v of variants) {
      await db
        .prepare(
          `INSERT INTO product_variants (
            id, product_id, color_name, color_hex, size, stock, sku, image_url, secondary_image_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          v.id || `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          productData.id,
          v.color_name,
          v.color_hex,
          v.size,
          v.stock,
          v.sku,
          v.image_url,
          v.secondary_image_url || null
        )
        .run();
    }
  }

  const updated = await getProductById(productData.id);
  return updated as Product;
}

/**
 * Deletes a product and its associated variants from Cloudflare D1.
 */
export async function deleteProductAdmin(productId: string): Promise<boolean> {
  await db.prepare('DELETE FROM product_variants WHERE product_id = ?').bind(productId).run();
  await db.prepare('DELETE FROM products WHERE id = ?').bind(productId).run();
  return true;
}

/**
 * Retrieves all inventory variants across all garments for the Studio Director inventory table.
 */
export async function getAllInventoryVariants(lowStock?: boolean): Promise<
  Array<{
    id: string;
    variant_id: string;
    product_id: string;
    product_title: string;
    sku: string;
    color_name: string;
    color_hex: string;
    size: string;
    stock: number;
    price: number;
    image_url: string;
  }>
> {
  let query = `SELECT 
        v.id as id,
        v.id as variant_id,
        v.product_id,
        p.title as product_title,
        v.sku,
        v.color_name,
        v.color_hex,
        v.size,
        v.stock,
        p.price,
        v.image_url
       FROM product_variants v
       JOIN products p ON v.product_id = p.id`;

  if (lowStock) {
    query += ` WHERE v.stock <= 10`;
  }

  query += ` ORDER BY p.title ASC, v.color_name ASC, v.size ASC`;

  const res = await db
    .prepare(query)
    .all<{
      id: string;
      variant_id: string;
      product_id: string;
      product_title: string;
      sku: string;
      color_name: string;
      color_hex: string;
      size: string;
      stock: number;
      price: number;
      image_url: string;
    }>();

  return res.results || [];
}

/**
 * Updates stock quantity for an individual garment variant directly in Cloudflare D1.
 */
export async function updateVariantStock(variantId: string, newStock: number): Promise<boolean> {
  const res = await db
    .prepare('UPDATE product_variants SET stock = ? WHERE id = ?')
    .bind(Math.max(0, Math.floor(newStock)), variantId)
    .run();
  const changes = (res as { meta?: { changes?: number } })?.meta?.changes;
  // If the driver doesn't report changes, assume success
  return changes === undefined ? true : changes > 0;
}
