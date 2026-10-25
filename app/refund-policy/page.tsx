import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { RotateCcw, CheckCircle, Clock, ShieldCheck, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { PolicyNav } from '@/components/layout/policy-nav';

export const metadata: Metadata = {
  title: 'Return, Refund & Exchange Policy | AVIVEKY Atelier',
  description: '7-day hassle-free returns and size exchanges for AVIVEKY apparel. Fast UPI & bank refunds with complimentary doorstep pickup.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-800">
      {/* Hero Header */}
      <div className="bg-black text-white py-14 sm:py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] uppercase tracking-widest font-mono">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Patron Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Returns, Exchanges &amp; Refunds
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Every garment should fit impeccably. If sizing or style doesn&apos;t meet your standards, our 7-day complimentary return &amp; exchange process ensures zero friction.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-2">
            Last Updated: October 2026 · 7 Days Doorstep Return &amp; Exchange Guarantee
          </div>
        </div>
      </div>

      <PolicyNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Highlight Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-zinc-200 text-center space-y-1 shadow-2xs">
            <Clock className="w-5 h-5 mx-auto text-black mb-2" />
            <span className="font-serif text-lg font-bold text-black block">7 Days</span>
            <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Return / Exchange Window</span>
          </div>

          <div className="p-5 bg-white border border-zinc-200 text-center space-y-1 shadow-2xs">
            <RotateCcw className="w-5 h-5 mx-auto text-black mb-2" />
            <span className="font-serif text-lg font-bold text-black block">Free Size Swap</span>
            <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Doorstep Reverse Pickup</span>
          </div>

          <div className="p-5 bg-white border border-zinc-200 text-center space-y-1 shadow-2xs">
            <CheckCircle className="w-5 h-5 mx-auto text-black mb-2" />
            <span className="font-serif text-lg font-bold text-black block">Fast Refunds</span>
            <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Direct UPI / Bank Source</span>
          </div>
        </div>

        {/* Section 1: 7-Day Policy */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            1. 7-Day Return &amp; Size Exchange Policy
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              We want you to feel confident in every piece you purchase from AVIVEKY. You may request a return or size exchange within <strong>7 calendar days</strong> of receiving your parcel.
            </p>
            <p>
              Whether you need to exchange an M for an L, swap a colorway, or return for a full monetary refund, we arrange convenient reverse doorstep pickup at no additional courier charge for initial exchanges.
            </p>
          </div>
        </section>

        {/* Section 2: Eligibility Criteria */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            2. Return Eligibility &amp; Condition Guidelines
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>To ensure eligibility for a full refund or exchange, garments must satisfy the following criteria upon quality inspection at our atelier:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="font-bold text-emerald-800 text-[11px] block flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Acceptable Conditions
                </span>
                <ul className="list-disc pl-4 space-y-1 text-zinc-600 text-[11px]">
                  <li>Unworn, unwashed, and without perfume/cologne odor</li>
                  <li>Original brand tags, barcode stickers, and woven labels intact</li>
                  <li>Original packaging or protective polybag included</li>
                  <li>Accompanied by original invoice or order confirmation ID</li>
                </ul>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="font-bold text-rose-800 text-[11px] block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Non-Returnable Items
                </span>
                <ul className="list-disc pl-4 space-y-1 text-zinc-600 text-[11px]">
                  <li>Items altered, washed, or tailored after delivery</li>
                  <li>Custom commissioned or personalized bespoke printed apparel</li>
                  <li>Garments marked &quot;Final Archive Clearance&quot;</li>
                  <li>Items reported after the 7-day post-delivery window</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Reverse Pickup & How to Initiate */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            3. How to Initiate a Return or Size Exchange
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-4 leading-relaxed">
            <p>Initiating a return takes less than 2 minutes via any of our automated channels:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200">
                <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-black text-xs block">Contact Customer Care</strong>
                  <span className="text-zinc-600">
                    Send a WhatsApp message to <a href="https://wa.me/918310274918" className="font-semibold underline text-black">+91 8310274918</a> or email <a href="mailto:snfabricsenquiry@gmail.com" className="font-semibold underline text-black">snfabricsenquiry@gmail.com</a> with your Order ID and reason for return or desired exchange size.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200">
                <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-black text-xs block">Doorstep Reverse Pickup</strong>
                  <span className="text-zinc-600">
                    Our logistics partner (Delhivery/BlueDart) will schedule a doorstep collection within 24 to 48 hours. Hand over the packaged garment to the courier associate.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200">
                <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-black text-xs block">Quality Inspection &amp; Refund / Replacement Dispatch</strong>
                  <span className="text-zinc-600">
                    Upon receipt at our atelier, the piece undergoes a quick 24-hour verification. Your exchange piece is dispatched immediately, or your refund is initiated without delay.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Refund Timelines & Methods */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            4. Refund Timelines &amp; Payout Channels
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2">
              <span className="text-black font-bold uppercase tracking-wider text-[11px] block">
                Prepaid Online Orders (UPI / Cards / Net Banking)
              </span>
              <p className="text-zinc-600">
                All approved refunds are credited directly back to the original source of payment (bank account, debit/credit card, or UPI VPA) via our secure Razorpay payment gateway.
              </p>
              <div className="p-2 bg-white border border-zinc-200 font-mono text-[11px] text-black font-semibold inline-block">
                Timeline: 5 to 7 Business Days (Instant for UPI in most cases)
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Order Cancellations */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            5. Order Cancellation Policy
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              You may cancel any order free of charge at any time <strong>prior to shipment dispatch</strong>. Simply message our WhatsApp concierge or reply to your order confirmation email.
            </p>
            <p>
              If your parcel has already been handed over to the courier partner, cancellation cannot be processed in transit; however, you can reject the delivery upon arrival or request a return within 7 days once delivered.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-6 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold">Need to Request a Size Exchange?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Drop a quick message on WhatsApp and our team will schedule reverse pickup.</p>
          </div>
          <a
            href="https://wa.me/918310274918?text=Hello%20AVIVEKY%2C%20I%20would%20like%20to%20request%20a%20return%20or%20exchange%20for%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Initiate on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
