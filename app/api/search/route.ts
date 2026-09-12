import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length < 1) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    const products = await getAllProducts({ search: query.trim() });
    const suggestions = products.slice(0, 6).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compare_at_price,
      category: p.category_name,
      imageUrl: p.variants?.[0]?.image_url || '',
    }));

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.error('[API Search] Error:', error);
    return NextResponse.json({ success: false, message: 'Search failed' }, { status: 500 });
  }
}
