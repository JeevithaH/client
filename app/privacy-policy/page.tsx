import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, Database, Mail, Phone, ArrowRight } from 'lucide-react';
import { PolicyNav } from '@/components/layout/policy-nav';

export const metadata: Metadata = {
  title: 'Privacy Policy | AVIVEKY Atelier & Store',
  description: 'Understand how AVIVEKY collects, safeguards, and processes your personal data and payment transactions under Indian Data Protection standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-800">
      {/* Hero Header */}
      <div className="bg-black text-white py-14 sm:py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] uppercase tracking-widest font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Legal &amp; Data Security</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Your trust is our paramount asset. Here is how AVIVEKY safeguards your personal information, payment credentials, and shopping history.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-2">
            Last Updated &amp; Effective: October 2026 · Compliant with IT Act 2000 &amp; DPDP Act
          </div>
        </div>
      </div>

      <PolicyNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Overview Banner */}
        <div className="p-6 bg-white border border-zinc-200 shadow-xs rounded-xs space-y-3">
          <div className="flex items-center gap-2.5 text-black font-semibold text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Commitment to Patron Privacy</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            This Privacy Policy governs the manner in which <strong>AVIVEKY</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, maintains, uses, and discloses information gathered from users of our website and associated digital portals. By utilizing our platform, you consent to the data practices described in this statement.
          </p>
        </div>

        {/* Section 1: Information Collected */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            1. Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white border border-zinc-200 space-y-2">
              <h3 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-black" /> Personal Details You Provide
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                When placing an order or registering an account, we may collect:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                <li>Full Name and contact telephone number</li>
                <li>Shipping and billing postal addresses</li>
                <li>Email address for order receipts &amp; dispatch updates</li>
                <li>Garment sizing preferences and custom design requests</li>
              </ul>
            </div>

            <div className="p-4 bg-white border border-zinc-200 space-y-2">
              <h3 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-black" /> Technical &amp; Device Information
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                When you browse our collections, our secure edge servers automatically receive:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                <li>IP address and approximate geographic location (city level)</li>
                <li>Device type, browser fingerprint, and screen resolution</li>
                <li>Session duration, catalog pages viewed, and cart updates</li>
                <li>Cookie identifiers and local cart storage markers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Payments & Financial Security */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            2. Payment Security &amp; Financial Information
          </h2>
          <div className="p-5 bg-white border border-zinc-200 space-y-3 text-xs leading-relaxed text-zinc-600">
            <p>
              All online payments on AVIVEKY are processed through authorized, RBI-licensed payment aggregators including <strong>Razorpay</strong> and certified UPI banking gateways.
            </p>
            <div className="p-3 bg-zinc-50 border-l-2 border-black space-y-1 text-zinc-700">
              <span className="font-bold uppercase tracking-wider text-[10px] block text-black">
                Zero Storage of Sensitive Card Credentials:
              </span>
              <p className="text-[11px]">
                AVIVEKY does not store, view, or process raw credit/debit card numbers, CVVs, or bank account passwords on our servers. All transactions comply strictly with <strong>PCI-DSS Level 1 Certification</strong> and RBI tokenization directives.
              </p>
            </div>
            <p>
              For all consignments, our customer concierge team may verify your shipping address and order confirmation via automated SMS, email, or WhatsApp notification.
            </p>
          </div>
        </section>

        {/* Section 3: Purpose of Processing */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            3. How We Utilize Your Information
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>We process collected data exclusively for the following lawful operational purposes:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 list-disc">
              <li>Order fulfillment, packaging, and pan-India dispatch</li>
              <li>Real-time shipment tracking updates via WhatsApp / SMS</li>
              <li>Processing size exchanges, cancellations, and refunds</li>
              <li>Customer service inquiry resolution and fit consultations</li>
              <li>Prevention of fraudulent transactions and duplicate accounts</li>
              <li>Opt-in alerts regarding exclusive limited-edition drops</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Data Sharing & Logistics */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            4. Sharing with Third-Party Service Providers
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              We do not sell, rent, or trade your personal information to third-party advertisers. Information is disclosed solely to vetted operational partners strictly on a need-to-know basis:
            </p>
            <div className="space-y-2 pt-1">
              <div className="border border-zinc-200 p-3 bg-zinc-50">
                <span className="font-bold text-zinc-900 block text-[11px]">Logistics &amp; Courier Partners:</span>
                <span className="text-[11px] text-zinc-600">
                  Your delivery name, address, and contact number are transmitted to integrated 3PL partners (including Delhivery, BlueDart, DTDC, and Shiprocket) solely to execute door-to-door delivery.
                </span>
              </div>
              <div className="border border-zinc-200 p-3 bg-zinc-50">
                <span className="font-bold text-zinc-900 block text-[11px]">Infrastructure &amp; Security:</span>
                <span className="text-[11px] text-zinc-600">
                  Data transmission is encrypted via SSL/TLS 1.3 edge proxies managed through Cloudflare Inc. and serverless databases located in secure data centers.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Cookies & User Rights */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            5. Cookies, Data Retention &amp; Your Rights
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              Our website uses cookies and browser local storage to maintain your shopping cart items, saved wishlist garments, and display preferences. You may adjust your browser settings to decline cookies, though this may prevent you from placing orders smoothly.
            </p>
            <p>
              Under the Digital Personal Data Protection (DPDP) Act, 2023, you retain the right to:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Request a copy of your personal data held in our catalog database</li>
              <li>Request rectification of incorrect addresses or details</li>
              <li>Request deletion of your patron profile and associated historical records</li>
              <li>Opt-out of promotional marketing communications at any time</li>
            </ul>
          </div>
        </section>

        {/* Section 6: Grievance Officer */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            6. Grievance Officer &amp; Inquiries
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-4 leading-relaxed">
            <p>
              In accordance with the Information Technology Act, 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Grievance Desk</span>
                <p className="font-semibold text-black flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:snfabricsenquiry@gmail.com" className="hover:underline">
                    snfabricsenquiry@gmail.com
                  </a>
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Concierge Helpline</span>
                <p className="font-semibold text-black flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <a href="tel:+918310274918" className="hover:underline">
                    +91 8310274918
                  </a>
                </p>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500">
              Operating Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST. We aim to address all grievances within 48 business hours.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-6 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold">Have Questions About Your Data?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Reach out to our customer care team via WhatsApp or Email.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 flex items-center gap-1.5 shrink-0"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
