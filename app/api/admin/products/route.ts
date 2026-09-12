import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, saveProductAdmin } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';
import { Product, ProductVariant } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('[API Admin Products GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { product, variants } = body;

    if (!product?.title || !product?.price || !product?.category_id) {
      return NextResponse.json(
        { success: false, message: 'Please provide title, price, and category' },
        { status: 400 }
      );
    }

    const productId = product.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const slug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      ...product,
      id: productId,
      slug,
      price: Number(product.price),
      compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
      is_featured: Boolean(product.is_featured),
      is_new: Boolean(product.is_new),
      is_bestseller: Boolean(product.is_bestseller),
      rating: product.rating || 4.8,
      reviews_count: product.reviews_count || 12,
    };

    const formattedVariants: ProductVariant[] = (variants || []).map((v: ProductVariant) => ({
      id: v.id || `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      product_id: productId,
      color_name: v.color_name || 'Standard',
      color_hex: v.color_hex || '#000000',
      size: v.size || 'M',
      stock: Number(v.stock || 10),
      sku: v.sku || `SF-${slug.toUpperCase().substring(0, 4)}-${v.size}-${Math.floor(100 + Math.random() * 900)}`,
      image_url: v.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
      secondary_image_url: v.secondary_image_url || undefined,
    }));

    const saved = await saveProductAdmin(newProduct, formattedVariants);

    return NextResponse.json({
      success: true,
      product: saved,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('[API Admin Products POST] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create product' }, { status: 500 });
  }
}
