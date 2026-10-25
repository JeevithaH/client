import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { FileText, Scale, ShieldCheck, ShoppingBag, AlertTriangle, ArrowRight } from 'lucide-react';
import { PolicyNav } from '@/components/layout/policy-nav';

export const metadata: Metadata = {
  title: 'Terms of Service | AVIVEKY Atelier & Store',
  description: 'Official terms and conditions governing purchases, website access, and user conduct on AVIVEKY.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-800">
      {/* Hero Header */}
      <div className="bg-black text-white py-14 sm:py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] uppercase tracking-widest font-mono">
            <Scale className="w-3.5 h-3.5 text-zinc-400" />
            <span>Store Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before placing orders or utilizing the digital services of AVIVEKY.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-2">
            Last Updated: October 2026 · Governing Indian E-Commerce Jurisdiction
          </div>
        </div>
      </div>

      <PolicyNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Preamble */}
        <div className="p-6 bg-white border border-zinc-200 space-y-3 shadow-xs">
          <span className="font-bold text-black uppercase tracking-wider text-xs block">
            Agreement to Terms
          </span>
          <p className="text-xs text-zinc-600 leading-relaxed">
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot; or &quot;Patron&quot;) and <strong>AVIVEKY</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), concerning your access to and use of our e-commerce portal and product catalog. By accessing the site or purchasing apparel, you confirm that you have read, understood, and agreed to be bound by all of these terms.
          </p>
        </div>

        {/* Section 1: Product Representation & Sizing */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            1. Garment Descriptions, Sizing &amp; Imagery
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              We endeavor to display the colors, textures, and silhouettes of our garments as accurately as possible. However, because display screens, calibrated color profiles, and ambient lighting vary, we cannot guarantee that your device will display garment dyes or screenprints with 100% color match.
            </p>
            <p>
              All sizing charts (S, M, L, XL, XXL) represent body and garment chest/length measurements in inches and centimeters. Standard sizing variance of ±0.5 inches may occur due to hand-tailoring and garment pre-shrink bio-washing.
            </p>
          </div>
        </section>

        {/* Section 2: Pricing & Taxes */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            2. Pricing, GST &amp; Billing
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              All prices displayed on the store are denominated in <strong>Indian Rupees (INR / ₹)</strong> and are inclusive of all applicable Goods and Services Tax (GST), unless expressly stated otherwise at checkout.
            </p>
            <p>
              We reserve the right to modify prices for limited-edition drops or promotional campaigns at any time without prior notice. In the event a product is erroneously listed with an incorrect price due to typographical error, we reserve the right to cancel any orders placed for that item and provide an immediate full refund.
            </p>
          </div>
        </section>

        {/* Section 3: Orders & Verification */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            3. Order Acceptance &amp; Right to Cancel
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              Receipt of an electronic order confirmation does not signify our final acceptance of your order. AVIVEKY reserves the right at any time after receipt of your order to accept, decline, or limit order quantities for any reason, including:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Product unavailability or fabric stock depletion</li>
              <li>Inability to obtain payment authorization via Razorpay</li>
              <li>Identification of suspected fraudulent, reseller, or automated bot activity</li>
              <li>Incomplete or unverified destination shipping address details</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            4. Limitation of Liability
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              In no event shall AVIVEKY, its directors, employees, or partners be liable to you for any indirect, incidental, punitive, or consequential damages arising from the use of our products or website. Our total aggregate liability for any claim arising out of your purchase shall strictly not exceed the amount actually paid by you for the specific garment giving rise to the claim.
            </p>
          </div>
        </section>

        {/* Section 5: Governing Law */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            5. Governing Law &amp; Jurisdiction
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              These Terms shall be governed by and defined following the laws of <strong>India</strong>. Any legal dispute, controversy, or claim arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-6 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold">Questions Regarding Store Terms?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Our support concierge is standing by to help with any inquiries.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 flex items-center gap-1.5 shrink-0"
          >
            <span>Contact Legal Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
