import { NextRequest, NextResponse } from 'next/server';
import { getAllInventoryVariants, updateVariantStock } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const lowStock = searchParams.get('lowStock') === 'true';

    const variants = await getAllInventoryVariants(lowStock);
    return NextResponse.json({ success: true, variants, count: variants.length });
  } catch (error) {
    console.error('[API Admin Inventory GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { variantId, stock } = body;

    if (!variantId || stock === undefined || stock < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid variant ID or negative stock value' },
        { status: 400 }
      );
    }

    const updated = await updateVariantStock(variantId, Number(stock));
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Variant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Inventory updated to ${stock} units`,
    });
  } catch (error) {
    console.error('[API Admin Inventory PUT] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update stock' }, { status: 500 });
  }
}
