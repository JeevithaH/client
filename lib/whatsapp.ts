/**
 * WhatsApp Concierge & Ordering Utility for Shipfold
 */

import { CartItem, Product, Address } from './types';

export const CONCIERGE_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918310246790';
export const CONCIERGE_PHONE_DISPLAY = process.env.NEXT_PUBLIC_HOTLINE_DISPLAY || '+91 8310246790';
export const CONCIERGE_PHONE_RAW = process.env.NEXT_PUBLIC_WHATSAPP_RAW || '8310246790';

export function getWhatsAppConciergeUrl(customMessage?: string): string {
  const text = customMessage || encodeURIComponent(
    'Greetings Shipfold Atelier Concierge. I am inquiring about custom T-shirts & your curated luxury collection.'
  );
  return `https://wa.me/${CONCIERGE_PHONE}?text=${text}`;
}

export function getWhatsAppCustomTShirtOrderUrl({
  silhouette,
  customizationType,
  fabric,
  color,
  quantityTier,
  customDetails,
  customerName,
  estimatedPrice,
}: {
  silhouette: string;
  customizationType: string;
  fabric: string;
  color: string;
  quantityTier: string;
  customDetails: string;
  customerName?: string;
  estimatedPrice?: string | number;
}): string {
  const message = [
    `*🏛️ SHIPFOLD BESPOKE ATELIER — CUSTOM T-SHIRT ORDER*`,
    `----------------------------------------`,
    `*Direct Hotline:* ${CONCIERGE_PHONE_DISPLAY}`,
    `----------------------------------------`,
    `*Silhouette:* ${silhouette}`,
    `*Customization Type:* ${customizationType}`,
    `*Fabric Grade:* ${fabric}`,
    `*Colourway:* ${color}`,
    `*Quantity Tier:* ${quantityTier}`,
    customDetails ? `*Custom Artwork / Instructions:* ${customDetails}` : null,
    estimatedPrice ? `*Estimated Unit Price:* ₹${Number(estimatedPrice).toLocaleString('en-IN')}` : null,
    customerName ? `*Patron Name:* ${customerName}` : null,
    `----------------------------------------`,
    `Kindly review these specifications, provide digital mockup proof, and confirm timeline for sample/production. Thank you.`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${CONCIERGE_PHONE}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppProductOrderUrl({
  product,
  color,
  size,
  quantity = 1,
  customerName,
  deliveryCity,
}: {
  product: Product;
  color: string;
  size: string;
  quantity?: number;
  customerName?: string;
  deliveryCity?: string;
}): string {
  const lineTotal = product.price * quantity;
  const url = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `https://shipfold.com/product/${product.slug}`;

  const message = [
    `*🏛️ SHIPFOLD ATELIER — BESPOKE WHATSAPP ORDER*`,
    `----------------------------------------`,
    `*Garment:* ${product.title}`,
    `*Colourway:* ${color}`,
    `*Size:* ${size}`,
    `*Quantity:* ${quantity}`,
    `*Unit Price:* ₹${product.price.toLocaleString('en-IN')}`,
    `*Total Value:* ₹${lineTotal.toLocaleString('en-IN')}`,
    customerName ? `*Patron Name:* ${customerName}` : null,
    deliveryCity ? `*Delivery City:* ${deliveryCity}` : null,
    `*Garment Reference:* ${url}`,
    `----------------------------------------`,
    `Please confirm stock availability and send UPI payment link for immediate dispatch. Thank you.`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${CONCIERGE_PHONE}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCartOrderUrl({
  items,
  subtotal,
  discountAmount,
  total,
  couponCode,
  customerName,
  customerPhone,
  shippingAddress,
}: {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: Address | string;
}): string {
  const itemsText = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.title}* (${item.colorName}, Size: ${item.size}) × ${item.quantity} = ₹${(
          item.price * item.quantity
        ).toLocaleString('en-IN')}`
    )
    .join('\n');

  let addressSummary = '';
  if (shippingAddress) {
    if (typeof shippingAddress === 'object') {
      addressSummary = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postal_code}`;
    } else {
      addressSummary = shippingAddress;
    }
  }

  const message = [
    `*🏛️ SHIPFOLD ATELIER — COMPLETE BAG ORDER*`,
    `----------------------------------------`,
    customerName ? `*Patron:* ${customerName}` : null,
    customerPhone ? `*Phone:* ${customerPhone}` : null,
    addressSummary ? `*Destination:* ${addressSummary}` : null,
    `----------------------------------------`,
    `*CURATED GARMENTS:*`,
    itemsText,
    `----------------------------------------`,
    `*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`,
    discountAmount > 0 ? `*Privilege Discount (${couponCode}):* -₹${discountAmount.toLocaleString('en-IN')}` : null,
    `*Gross Payable:* ₹${total.toLocaleString('en-IN')}`,
    `----------------------------------------`,
    `Kindly generate my order invoice and provide payment instructions. Thank you.`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${CONCIERGE_PHONE}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppOrderTrackingUrl(orderNumber: string, customerName: string): string {
  const message = [
    `*🏛️ SHIPFOLD ORDER INQUIRY*`,
    `----------------------------------------`,
    `*Order Number:* ${orderNumber}`,
    `*Patron:* ${customerName}`,
    `----------------------------------------`,
    `Greetings Concierge, kindly share dispatch updates or tracking airway bill details for my order.`,
  ].join('\n');

  return `https://wa.me/${CONCIERGE_PHONE}?text=${encodeURIComponent(message)}`;
}
