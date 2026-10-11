import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { PolicyNav } from '@/components/layout/policy-nav';

export const metadata: Metadata = {
  title: 'Delivery & Shipping Policy | STiTCH Atelier',
  description: 'Pan-India express shipping details, estimated delivery timelines, free delivery threshold, and order tracking terms for STiTCH.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-800">
      {/* Hero Header */}
      <div className="bg-black text-white py-14 sm:py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] uppercase tracking-widest font-mono">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Pan-India Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Delivery &amp; Shipping Policy
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Fast, insured, and tracked doorstep delivery across 27,000+ pin codes in India. Learn about our dispatch timelines and tracking protocol.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-2">
            Last Updated: October 2026 · Free Express Delivery on Orders &gt; ₹499
          </div>
        </div>
      </div>

      <PolicyNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Highlight Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-zinc-200 text-center space-y-1 shadow-2xs">
            <Clock className="w-5 h-5 mx-auto text-black mb-2" />
            <span className="font-serif text-lg font-bold text-black block">24 - 48 Hours</span>
            <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Swift Order Dispatch</span>
          </div>

          <div className="p-5 bg-white border border-zinc-200 text-center space-y-1 shadow-2xs">
            <Truck className="w-5 h-5 mx-auto text-black mb-2" />
            <span className="font-serif text-lg font-bold text-black block">2 - 5 Business Days</span>
            <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Pan-India Delivery</span>
          </div>

          <div className="p-5 bg-white border border-zinc-200 text-center space-y-1 shadow-2xs">
            <ShieldCheck className="w-5 h-5 mx-auto text-black mb-2" />
            <span className="font-serif text-lg font-bold text-black block">100% Insured</span>
            <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Tamper-Proof Transit</span>
          </div>
        </div>

        {/* Section 1: Pan-India Delivery Coverage */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            1. Pan-India Delivery Network
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              STiTCH partners with premier express logistics networks—including <strong>Delhivery Express</strong>, <strong>BlueDart</strong>, <strong>DTDC</strong>, and <strong>Shiprocket</strong>—to provide reliable, door-to-door delivery across all 28 states and 8 union territories of India.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-black block text-[11px]">Metro Cities</span>
                <span className="text-zinc-500 text-[11px]">Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Pune</span>
                <span className="text-black font-semibold text-[11px] block mt-1 font-mono">2 – 3 Business Days</span>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-black block text-[11px]">Tier 2 &amp; Tier 3 Cities</span>
                <span className="text-zinc-500 text-[11px]">State capitals, major commercial hubs &amp; surrounding districts</span>
                <span className="text-black font-semibold text-[11px] block mt-1 font-mono">3 – 5 Business Days</span>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-black block text-[11px]">Regional &amp; North-East</span>
                <span className="text-zinc-500 text-[11px]">Jammu &amp; Kashmir, North-Eastern states, and remote postal zones</span>
                <span className="text-black font-semibold text-[11px] block mt-1 font-mono">5 – 7 Business Days</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Shipping Charges */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            2. Shipping Fees &amp; Order Thresholds
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-zinc-200">
                <thead className="bg-zinc-100 text-[10px] uppercase tracking-wider text-black font-bold">
                  <tr>
                    <th className="p-3 border-b border-zinc-200">Order Value / Payment Type</th>
                    <th className="p-3 border-b border-zinc-200">Shipping Charge</th>
                    <th className="p-3 border-b border-zinc-200">Estimated Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">Orders Above ₹499 (Prepaid via UPI/Card)</td>
                    <td className="p-3 font-bold text-emerald-600 uppercase font-mono">FREE Express Shipping</td>
                    <td className="p-3 text-zinc-600 font-mono">2 – 4 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">Orders Below ₹499 (Prepaid)</td>
                    <td className="p-3 font-mono text-zinc-900">₹60 Flat Shipping</td>
                    <td className="p-3 text-zinc-600 font-mono">2 – 5 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">Cash on Delivery (COD)</td>
                    <td className="p-3 font-mono text-zinc-900">₹50 Courier Handling Fee</td>
                    <td className="p-3 text-zinc-600 font-mono">3 – 5 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-zinc-500 pt-1">
              * Note: Custom bespoke commissions or bulk orders exceeding 15 units may have customized freight quotes provided at checkout.
            </p>
          </div>
        </section>

        {/* Section 3: Order Processing & Tracking */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            3. Order Tracking &amp; WhatsApp Notifications
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              Once your order has been quality checked and handed over to our courier partner, you will receive:
            </p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>An <strong>SMS notification</strong> containing your unique AWB tracking number.</li>
              <li>A direct <strong>WhatsApp message</strong> with a live tracking hyperlink to track driver milestones.</li>
              <li>An <strong>Email dispatch confirmation</strong> detailing items, invoice, and courier partner name.</li>
            </ul>
            <p className="pt-1">
              You can also track your shipment anytime directly from our website via the{' '}
              <Link href="/account" className="text-black font-semibold underline">
                Account &amp; Orders portal
              </Link>.
            </p>
          </div>
        </section>

        {/* Section 4: Cash on Delivery Terms */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            4. Cash on Delivery (COD) Guidelines
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              Cash on Delivery is available for most serviceable pin codes. To guarantee successful delivery:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Please keep exact cash ready or request the delivery associate to show their official QR code for digital UPI payment on arrival.</li>
              <li>Our team sends an automated verification prompt on WhatsApp prior to shipment. Orders that remain unverified after 48 hours may be cancelled automatically.</li>
              <li>Refusal of verified COD orders without legitimate damage or cause may restrict future COD access for that delivery address.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Transit Damage & Missing Items */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            5. Tampered or Damaged Parcels
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Important Delivery Recommendation:</strong> If the outer polybag or security seal appears torn, cut, or tampered with at the time of delivery, please do not accept the package or record a clear continuous video while unboxing.
              </div>
            </div>
            <p>
              In the unlikely event of transit damage or missing items, contact us within <strong>48 hours of delivery</strong> at <a href="mailto:the.stitchclothes@gmail.com" className="font-semibold underline">the.stitchclothes@gmail.com</a> or via WhatsApp concierge with photos/video of the outer carton and garments. We will dispatch a brand-new replacement immediately at zero additional expense.
            </p>
          </div>
        </section>

        {/* Bottom Contact Help */}
        <div className="p-6 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold">Have Questions About a Current Delivery?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Contact our shipping logistics desk on WhatsApp for instant assistance.</p>
          </div>
          <a
            href="https://wa.me/916395463874?text=Hello%20STiTCH%2C%20I%20have%20an%20inquiry%20regarding%20my%20delivery."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>WhatsApp Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
