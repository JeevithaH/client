import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Copyright, Award, Mail, ArrowRight } from 'lucide-react';
import { PolicyNav } from '@/components/layout/policy-nav';

export const metadata: Metadata = {
  title: 'Copyright & Design Rights | AVIVEKY',
  description: 'Official copyright statement, original graphic art protections, and brand design rights for AVIVEKY.',
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-800">
      {/* Hero Header */}
      <div className="bg-black text-white py-14 sm:py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] uppercase tracking-widest font-mono">
            <Copyright className="w-3.5 h-3.5 text-zinc-400" />
            <span>Brand &amp; Design Ownership</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Copyright &amp; Design Rights
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            All original garment patterns, typography, graphic art, photography, and brand identifiers are creative works of AVIVEKY.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-2">
            © 2026 AVIVEKY. All Rights Reserved.
          </div>
        </div>
      </div>

      <PolicyNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Core Statement Box */}
        <div className="p-6 bg-white border border-zinc-200 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-black text-sm uppercase tracking-wider">
            <Award className="w-4 h-4 text-black" />
            <span>Copyright Statement</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            All content appearing on this website—including but not limited to garment designs, custom typography, anime-inspired illustrations, lookbook photography, video content, UI layouts, brand logos, and artwork—is the exclusive creative property of <strong>AVIVEKY</strong>.
          </p>
        </div>

        {/* Section 1: Proprietary Artwork & Design */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            1. Original Garment Designs &amp; Graphic Art
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-white border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] block">
                Bespoke Graphics &amp; Screenprints
              </span>
              <p className="text-zinc-600 leading-relaxed">
                All customized typography, anime-inspired street graphics, puff prints, and embroidery patterns featured across our hoodies, t-shirts, and polos are original artistic creations developed in-house. Unauthorized reproduction, vector extraction, or commercial copying is prohibited.
              </p>
            </div>

            <div className="p-5 bg-white border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] block">
                Catalog &amp; Lookbook Photography
              </span>
              <p className="text-zinc-600 leading-relaxed">
                All editorial images, product packshots, model photography, and visual staging hosted on our high-speed Cloudflare R2 storage are proprietary brand assets. Use of our photography for external commercial sale or reselling without permission is not permitted.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Brand Protection */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            2. Brand Integrity &amp; Authentic Merchandise
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>To preserve our brand identity and protect our patrons, please note:</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>Reproduction, imitation, or counterfeit production of garments bearing the AVIVEKY name, woven label, or logos is strictly prohibited.</li>
              <li>Unauthorized commercial distribution or digital scraping of our product imagery is not allowed.</li>
              <li>Authentic AVIVEKY merchandise is exclusively sold through our official web store and authorized direct channels.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Press, Media & Permissions */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            3. Press, Editorial &amp; Collaboration Inquiries
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              Fashion stylists, publications, and digital creators looking to feature AVIVEKY pieces in lookbooks, photo shoots, or media features are warmly invited to get in touch with our team for high-resolution assets and styling samples.
            </p>
            <div className="p-4 bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Official Contact</span>
                <span className="font-semibold text-black text-xs flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-600" />
                  snfabricsenquiry@gmail.com
                </span>
              </div>
              <a
                href="mailto:snfabricsenquiry@gmail.com?subject=Brand%20Inquiry%20-%20AVIVEKY"
                className="px-4 py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 shrink-0 text-center"
              >
                Send Email
              </a>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-6 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold">Have an Inquiry or Project Proposal?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Reach out to our creative studio team.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 flex items-center gap-1.5 shrink-0"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
