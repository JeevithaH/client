import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrderWithInventoryDeduction } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'shipfold_webhook_secret_demo';

    // Verify signature in production if secret is configured and not demo
    if (webhookSecret && !webhookSecret.includes('demo') && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};

      console.log('[Razorpay Webhook] Payment captured:', paymentEntity?.id);

      // If full order payload was attached in notes
      if (notes.orderPayload) {
        try {
          const orderData = JSON.parse(notes.orderPayload);
          await createOrderWithInventoryDeduction({
            ...orderData,
            payment_status: 'Paid',
            razorpay_payment_id: paymentEntity.id,
          });
        } catch (err) {
          console.warn('[Webhook] Could not parse orderPayload in notes:', err);
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('[Razorpay Webhook Error]:', error);
    return NextResponse.json({ success: false, message: 'Webhook processing error' }, { status: 500 });
  }
}
