import { NextRequest, NextResponse } from 'next/server';
import { getProductById, saveProductAdmin, deleteProductAdmin } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';
import { Product, ProductVariant } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('[API Admin Product ID GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { product, variants } = body;

    const existing = await getProductById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const updatedProduct: Product = {
      ...existing,
      ...product,
      id: params.id,
      price: Number(product.price ?? existing.price),
      compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
      is_featured: Boolean(product.is_featured),
      is_new: Boolean(product.is_new),
      is_bestseller: Boolean(product.is_bestseller),
    };

    const updatedVariants: ProductVariant[] = (variants || existing.variants || []).map((v: ProductVariant) => ({
      ...v,
      id: v.id || `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      product_id: params.id,
      stock: Number(v.stock),
    }));

    const saved = await saveProductAdmin(updatedProduct, updatedVariants);

    return NextResponse.json({
      success: true,
      product: saved,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('[API Admin Product ID PUT] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await deleteProductAdmin(params.id);
    return NextResponse.json({
      success: true,
      message: 'Product deleted from archive successfully',
    });
  } catch (error) {
    console.error('[API Admin Product ID DELETE] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
}
