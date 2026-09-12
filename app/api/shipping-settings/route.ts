import { NextRequest, NextResponse } from 'next/server';
import { getShippingSettings, updateShippingSettings, ShippingSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getShippingSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Failed to get shipping settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve shipping settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { freeShippingEnabled, freeShippingThreshold, standardShippingFee, shippingNotice, freeShippingAllOrders } = body;

    const updated = await updateShippingSettings({
      freeShippingEnabled: typeof freeShippingEnabled === 'boolean' ? freeShippingEnabled : undefined,
      freeShippingThreshold: typeof freeShippingThreshold === 'number' ? freeShippingThreshold : undefined,
      standardShippingFee: typeof standardShippingFee === 'number' ? standardShippingFee : undefined,
      shippingNotice: typeof shippingNotice === 'string' ? shippingNotice : undefined,
      freeShippingAllOrders: typeof freeShippingAllOrders === 'boolean' ? freeShippingAllOrders : undefined,
    });

    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'Shipping settings updated successfully',
    });
  } catch (error) {
    console.error('Failed to update shipping settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update shipping settings' },
      { status: 500 }
    );
  }
}
