import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getCategories } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const size = searchParams.get('size') || undefined;
    const color = searchParams.get('color') || undefined;
    const isFeatured = searchParams.get('featured') === 'true';
    const isNew = searchParams.get('new') === 'true';
    const isBestseller = searchParams.get('bestseller') === 'true';

    const products = await getAllProducts({
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      size,
      color,
      isFeatured,
      isNew,
      isBestseller,
    });

    const categories = await getCategories();

    return NextResponse.json({
      success: true,
      products,
      categories,
      total: products.length,
    });
  } catch (error) {
    console.error('[API Products] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}
