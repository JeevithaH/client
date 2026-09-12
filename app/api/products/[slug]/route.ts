import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, getAllProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Related products in the same category or bestsellers
    const allProducts = await getAllProducts();
    const relatedProducts = allProducts
      .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.is_bestseller))
      .slice(0, 4);

    return NextResponse.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error('[API Product Slug] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product' }, { status: 500 });
  }
}
