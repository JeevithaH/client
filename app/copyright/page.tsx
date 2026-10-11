import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Copyright, ShieldAlert, Award, FileCheck, Mail, ArrowRight } from 'lucide-react';
import { PolicyNav } from '@/components/layout/policy-nav';

export const metadata: Metadata = {
  title: 'Copyright & Intellectual Property Notice | STiTCH',
  description: 'Official copyright statement, design patents, proprietary graphic art protections, and IP infringement reporting guidelines for STiTCH.',
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-800">
      {/* Hero Header */}
      <div className="bg-black text-white py-14 sm:py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] uppercase tracking-widest font-mono">
            <Copyright className="w-3.5 h-3.5 text-zinc-400" />
            <span>Intellectual Property Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Copyright &amp; Trademark Notice
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            All original garment patterns, typography, graphic art, photography, and brand identifiers are legally protected works of STiTCH.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-2">
            © 2026 STiTCH (Stitchclothes / Nirvigna Studio). All Rights Reserved.
          </div>
        </div>
      </div>

      <PolicyNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Core Notice Box */}
        <div className="p-6 bg-white border border-zinc-200 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-black text-sm uppercase tracking-wider">
            <Award className="w-4 h-4 text-black" />
            <span>Universal Copyright Declaration</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            All content appearing on this website—including but not limited to text, artwork, vector graphics, typography, bespoke anime illustrations, lookbook photography, video clips, UI layouts, icons, and software code—is the proprietary property of <strong>STiTCH</strong> and is protected under the <strong>Indian Copyright Act, 1957</strong>, the <strong>Trade Marks Act, 1999</strong>, and international intellectual property treaties.
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
                All customized typography, anime-inspired street graphics, puff prints, and embroidery patterns featured across our hoodies, t-shirts, and polos are original artistic creations developed in-house or under exclusive license. Unauthorized reproduction, vector extraction, or imitation is strictly prohibited.
              </p>
            </div>

            <div className="p-5 bg-white border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] block">
                Catalog &amp; Lookbook Photography
              </span>
              <p className="text-zinc-600 leading-relaxed">
                All editorial images, product packshots, model photography, and visual staging hosted on our high-speed Cloudflare R2 storage are proprietary intellectual assets. Use of our imagery for external commerce, dropshipping, or marketplace reselling without written consent constitutes copyright infringement.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Prohibited Conduct */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            2. Prohibited Uses &amp; Anti-Counterfeiting
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>Except with express written authorization from STiTCH, you are strictly prohibited from:</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>Copying, reproducing, republishing, or distributing any graphic print or photograph found on this website.</li>
              <li>Producing counterfeit or replica garments utilizing STiTCH brand logos, labels, or trademarked silhouettes.</li>
              <li>Scraping, crawling, or extracting product databases, inventory pricing, or high-resolution imagery using automated scrapers or bots.</li>
              <li>Framing or deep-linking to any part of this store in a manner that creates false association or misrepresentation.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Infringement Notice Protocol */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            3. Reporting Copyright &amp; IP Infringement
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-4 leading-relaxed">
            <div className="flex items-start gap-2.5 p-3 bg-zinc-50 border border-zinc-200">
              <ShieldAlert className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
              <div>
                <strong>Notice of Infringement / Takedown Request:</strong> If you believe that your copyrighted work has been copied in a manner that constitutes copyright infringement, please provide our designated legal counsel with a formal written notice containing:
              </div>
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>A physical or electronic signature of the authorized copyright owner</li>
              <li>Identification of the copyrighted work claimed to have been infringed</li>
              <li>Direct URL or location on our website where the claimed material is located</li>
              <li>Your contact information (name, postal address, telephone, and email)</li>
              <li>A statement made in good faith that the disputed use is unauthorized</li>
            </ul>
            <div className="p-4 bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Designated IP Legal Contact</span>
                <span className="font-semibold text-black text-xs">the.stitchclothes@gmail.com</span>
              </div>
              <a
                href="mailto:the.stitchclothes@gmail.com?subject=Intellectual%20Property%20Inquiry"
                className="px-4 py-1.5 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 shrink-0"
              >
                Send Legal Notice
              </a>
            </div>
          </div>
        </section>

        {/* Section 4: Press & Editorial Usage */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-black border-b border-zinc-200 pb-2">
            4. Press, Media &amp; Lookbook Permissions
          </h2>
          <div className="p-5 bg-white border border-zinc-200 text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              Members of the press, fashion publications, and digital creators wishing to feature STiTCH collections or interview our creative directors are welcome to request our high-resolution press kit and lookbook imagery.
            </p>
            <p>
              Please address all editorial and media requests to <a href="mailto:the.stitchclothes@gmail.com" className="font-semibold underline">the.stitchclothes@gmail.com</a> with the subject line <em>&quot;Press &amp; Media Kit Request&quot;</em>.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-6 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold">Have an IP or Collaboration Inquiry?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Reach out to our brand legal &amp; partnerships desk.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 flex items-center gap-1.5 shrink-0"
          >
            <span>Contact Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
