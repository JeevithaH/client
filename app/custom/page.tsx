'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Palette,
  Layers,
  Scissors,
  Send,
  ArrowRight,
  HelpCircle,
  Truck,
} from 'lucide-react';
import {
  CONCIERGE_PHONE_DISPLAY,
  CONCIERGE_PHONE_RAW,
  getWhatsAppCustomTShirtOrderUrl,
} from '@/lib/whatsapp';
import { useToast } from '@/context/toast-context';

const SILHOUETTES = [
  {
    id: 'supima_crew',
    name: 'Sovereign Supima Crew',
    gsm: '190 GSM',
    fabric: '100% American Supima® Cotton',
    basePrice: 2199,
    desc: 'The gold standard of luxury drape, silk-like hand feel, and anti-curl collar.',
    image: '/products/tee_white.jpg',
  },
  {
    id: 'heavy_boxy',
    name: 'Biella Heavyweight Boxy Tee',
    gsm: '280 GSM',
    fabric: 'Compact Organic French Jersey',
    basePrice: 2299,
    desc: 'Authoritative structured silhouette with drop shoulders and architectural drape.',
    image: '/products/tee_black.jpg',
  },
  {
    id: 'mercerized_polo',
    name: 'Regal Mercerized Piqué Polo',
    gsm: '220 GSM',
    fabric: 'Egyptian Giza 88 Cotton',
    basePrice: 2699,
    desc: 'Structured knit collar with mother-of-pearl buttons. Ideal for executive corporate apparel.',
    image: '/products/polo_navy.jpg',
  },
  {
    id: 'vintage_washed',
    name: 'Verona Mineral Washed Boxy',
    gsm: '300 GSM',
    fabric: 'Pumice Stone Washed Cotton',
    basePrice: 2499,
    desc: 'Enzyme-softened vintage patina with subtle distressed edge finishes.',
    image: '/products/tee_grey.jpg',
  },
  {
    id: 'milano_mockneck',
    name: 'Milano Architectural Mock-Neck',
    gsm: '250 GSM',
    fabric: 'Double-Knit Interlock Cotton',
    basePrice: 2599,
    desc: 'Elevated 1.75-inch stand collar. Designed for modern luxury layering.',
    image: '/products/tee_olive.jpg',
  },
];

const CUSTOM_TECHNIQUES = [
  {
    id: 'embroidery',
    name: 'Master Needlework Embroidery',
    desc: 'Fine Madeira metallic or tonal thread crests, initials, or corporate insignias. Maximum luxury durability.',
    badge: 'Signature Atelier',
  },
  {
    id: 'puff_print',
    name: 'High-Density 3D Puff Screen Print',
    desc: 'Raised tactile lettering with clean, rounded dimensional edges that never crack.',
    badge: 'Streetwear Luxury',
  },
  {
    id: 'pigment_print',
    name: 'Japanese Water-Based Silkscreen',
    desc: 'Ultra-soft hand feel where the ink dyes the fiber itself. Zero plastic residue.',
    badge: 'Artisan Finish',
  },
  {
    id: 'dtg_photo',
    name: 'Ultra-HD Direct-To-Garment (DTG)',
    desc: 'Full-spectrum photographic fidelity with 1200 DPI archival textile pigments.',
    badge: 'Complex Artworks',
  },
  {
    id: 'woven_labels',
    name: 'Bespoke Woven Neck & Hem Labels',
    desc: 'Custom damask high-definition woven tags and care labels for full brand white-labeling.',
    badge: 'Brand Edition',
  },
];

const FABRICS = [
  { id: 'supima', name: '100% American Supima® (190 GSM)', desc: 'Extra-long staple cotton for unmatched softness.' },
  { id: 'french_jersey', name: 'Organic French Jersey (280 GSM)', desc: 'Substantial, heavyweight structured contour.' },
  { id: 'giza_cotton', name: 'Double-Mercerized Giza 88 (220 GSM)', desc: 'Silky luster, high tensile strength, rich drape.' },
  { id: 'enzyme_washed', name: 'Pumice Stone Enzyme Washed (250 GSM)', desc: 'Vintage lived-in softness with subtle fading.' },
];

const COLORWAYS = [
  { name: 'Onyx Noir', hex: '#111215' },
  { name: 'Chalk White', hex: '#F9F8F5' },
  { name: 'Midnight Navy', hex: '#0C172D' },
  { name: 'Tuscan Olive', hex: '#434B3C' },
  { name: 'Vintage Acid Charcoal', hex: '#2B2D31' },
  { name: 'Sand Dune Ecru', hex: '#D8D1C4' },
  { name: 'Royal Burgundy', hex: '#4A1D27' },
];

const QUANTITY_TIERS = [
  { id: 'single', name: 'Single Piece Bespoke (1-5 Pcs)', discountText: 'Personal Luxury / Sample Approval', multiplier: 1.0 },
  { id: 'small_batch', name: 'Boutique Batch (10-49 Pcs)', discountText: '15% Volume Privilege Applied', multiplier: 0.85 },
  { id: 'corporate', name: 'Corporate & Studio (50-200+ Pcs)', discountText: '30% Atelier Enterprise Privilege', multiplier: 0.70 },
];

export default function CustomTShirtPage() {
  const { success, error } = useToast();

  const [selectedSilhouette, setSelectedSilhouette] = useState(SILHOUETTES[0]);
  const [selectedTechnique, setSelectedTechnique] = useState(CUSTOM_TECHNIQUES[0]);
  const [selectedFabric, setSelectedFabric] = useState(FABRICS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORWAYS[0]);
  const [selectedTier, setSelectedTier] = useState(QUANTITY_TIERS[0]);

  const [customDetails, setCustomDetails] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [placementPosition, setPlacementPosition] = useState('Left Chest (Classic Monogram)');

  const [activeTab, setActiveTab] = useState<'bulk' | 'request'>('bulk');

  // Request a Product / Custom Design state
  const [reqSilhouette, setReqSilhouette] = useState('Heavyweight Boxy Tee (280 GSM)');
  const [reqColor, setReqColor] = useState('Pitch Black');
  const [reqQuantity, setReqQuantity] = useState('25 Pcs');
  const [reqTechnique, setReqTechnique] = useState('Puff 3D Screen Print');
  const [reqDesignBrief, setReqDesignBrief] = useState('');
  const [reqReferenceLink, setReqReferenceLink] = useState('');
  const [reqCustomerName, setReqCustomerName] = useState('');
  const [reqCustomerPhone, setReqCustomerPhone] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tab') === 'request') {
        setActiveTab('request');
      }
    }
  }, []);

  const getDynamicPreviewImage = () => {
    const c = selectedColor.name.toLowerCase();
    const isPolo = selectedSilhouette.id === 'mercerized_polo';
    if (isPolo) {
      if (c.includes('navy')) return '/products/polo_navy.jpg';
      if (c.includes('olive')) return '/products/polo_olive.jpg';
      if (c.includes('burgundy') || c.includes('wine')) return '/products/polo_wine.jpg';
      return '/products/polo_black.jpg';
    }
    if (c.includes('white') || c.includes('chalk')) return '/products/tee_white.jpg';
    if (c.includes('noir') || c.includes('black')) return '/products/tee_black.jpg';
    if (c.includes('navy')) return '/products/tee_navy.jpg';
    if (c.includes('olive')) return '/products/tee_olive.jpg';
    if (c.includes('ecru') || c.includes('sand')) return '/products/tee_sand.jpg';
    if (c.includes('burgundy')) return '/products/tee_maroon.jpg';
    if (c.includes('charcoal')) return '/products/tee_grey.jpg';
    return selectedSilhouette.image;
  };

  const estimatedUnitPrice = Math.round(selectedSilhouette.basePrice * selectedTier.multiplier);

  const handleOrderWhatsApp = () => {
    const url = getWhatsAppCustomTShirtOrderUrl({
      silhouette: `${selectedSilhouette.name} (${selectedSilhouette.gsm})`,
      customizationType: `${selectedTechnique.name} [Placement: ${placementPosition}]`,
      fabric: selectedFabric.name,
      color: selectedColor.name,
      quantityTier: selectedTier.name,
      customDetails: customDetails.trim() || 'Custom embroidery / logo printing to be finalized.',
      customerName: customerName.trim() || undefined,
      estimatedPrice: estimatedUnitPrice,
    });
    window.open(url, '_blank');
    success('Opening WhatsApp with your bespoke custom order specifications!');
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      error('Please provide a valid phone or WhatsApp number');
      return;
    }
    success(`Thank you ${customerName || 'Patron'}. Our Master Tailor will reach you at ${customerPhone} within 2 business hours.`);
    // Also trigger WhatsApp for instant response
    handleOrderWhatsApp();
  };

  const handleCustomRequestWhatsApp = () => {
    if (!reqCustomerPhone.trim()) {
      error('Please provide a phone or WhatsApp number');
      return;
    }
    let message = '*SHIPFOLD - NEW CUSTOM T-SHIRT / PRODUCT REQUEST*\n' +
      '----------------------------------------\n' +
      `*Silhouette / Cut:* ${reqSilhouette}\n` +
      `*Colorway:* ${reqColor}\n` +
      `*Quantity Expected:* ${reqQuantity}\n` +
      `*Technique:* ${reqTechnique}\n` +
      `*Design Brief:* ${reqDesignBrief.trim() || 'Custom artwork discussion required'}\n`;

    if (reqReferenceLink.trim()) {
      message += `*Reference Link:* ${reqReferenceLink.trim()}\n`;
    }

    message += `*Patron:* ${reqCustomerName.trim() || 'Valued Patron'}\n` +
      `*Phone:* ${reqCustomerPhone.trim()}\n` +
      '----------------------------------------\n' +
      'Please confirm manufacturing feasibility, turnaround time, and quote.';

    const url = `https://wa.me/918310246790?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    success('Submitting your custom product request directly to WhatsApp!');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0E0E0E]">
      {/* 1. Haute Couture Hero Banner */}
      <section className="relative w-full min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0C1427] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop"
            alt="Shipfold Bespoke Custom T-Shirt Atelier"
            fill
            priority
            className="object-cover object-center brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1427] via-transparent to-[#0C1427]/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-[#C5A880]/50 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              The Bespoke Atelier • Custom Made-To-Order
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.15] mb-6 max-w-4xl">
            Custom Luxury T-Shirts Engineered to Your Distinction
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed mb-8 tracking-wide">
            From single-piece private monograms in metallic Madeira needlework to executive corporate collections in 280 GSM heavyweight French jersey. Direct atelier consultations via WhatsApp and phone.
          </p>

          {/* Contact Strip Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <a
              href="tel:+918310246790"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-[#0C1427] hover:bg-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-xl"
            >
              <Phone className="w-4 h-4" />
              <span>Call Atelier: +91 8310246790</span>
            </a>

            <a
              href="https://wa.me/918310246790?text=Hello%20Shipfold%2C%20I%20would%20like%20to%20inquire%20about%20custom%20T-shirt%20embroidery%20and%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-xl"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct: 8310246790</span>
            </a>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-[10px] uppercase tracking-[0.2em] text-white/70">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" /> 1 Piece Samples Welcome</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" /> 3-5 Days Rapid Turnaround</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" /> PAN India Express Delivery</span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Customizer Studio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
            Bespoke T-Shirt Studio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0C1427] mt-1 mb-3">
            Custom T-Shirts &amp; Bulk Orders
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed">
            We exclusively craft luxury T-shirts with custom prints, embroidery, and private cuts. Choose volume bulk production or request a brand-new custom T-shirt product.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-zinc-200/80 border border-zinc-300">
            <button
              type="button"
              onClick={() => setActiveTab('bulk')}
              className={`px-6 sm:px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-all ${
                activeTab === 'bulk'
                  ? 'bg-[#0E0E0E] text-white shadow-md'
                  : 'text-zinc-600 hover:text-black hover:bg-white/60'
              }`}
            >
              Bulk T-Shirt Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('request')}
              className={`px-6 sm:px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-all ${
                activeTab === 'request'
                  ? 'bg-[#0E0E0E] text-white shadow-md'
                  : 'text-zinc-600 hover:text-black hover:bg-white/60'
              }`}
            >
              Request a Product / Design
            </button>
          </div>
        </div>

        {activeTab === 'bulk' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Select Silhouette */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#0C1427] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0C1427] text-white text-[10px] flex items-center justify-center">1</span>
                  Select Garment Silhouette
                </span>
                <span className="text-[11px] text-[#C5A880] font-mono font-medium">{selectedSilhouette.gsm}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SILHOUETTES.map((sil) => {
                  const isSelected = selectedSilhouette.id === sil.id;
                  return (
                    <button
                      key={sil.id}
                      type="button"
                      onClick={() => setSelectedSilhouette(sil)}
                      className={`p-4 text-left border transition-all ${
                        isSelected
                          ? 'border-[#0C1427] bg-white shadow-md ring-1 ring-[#0C1427]'
                          : 'border-zinc-200 bg-white/70 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-serif text-sm font-semibold text-[#0C1427]">{sil.name}</h4>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-zinc-100 text-zinc-700">
                          {sil.gsm}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 mt-1">
                        {sil.desc}
                      </p>
                      <div className="mt-2 text-xs font-semibold text-[#C5A880]">
                        Starts at ₹{sil.basePrice.toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Customization Technique */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#0C1427] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0C1427] text-white text-[10px] flex items-center justify-center">2</span>
                  Customization Technique
                </span>
                <span className="text-[11px] text-zinc-500">{selectedTechnique.badge}</span>
              </div>
              <div className="space-y-2">
                {CUSTOM_TECHNIQUES.map((tech) => {
                  const isSelected = selectedTechnique.id === tech.id;
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => setSelectedTechnique(tech)}
                      className={`w-full p-3.5 text-left border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#0C1427] bg-white shadow-md ring-1 ring-[#0C1427]'
                          : 'border-zinc-200 bg-white/70 hover:border-zinc-400'
                      }`}
                    >
                      <div className="pr-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#0C1427]">{tech.name}</h4>
                          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#FAF4ED] text-[#C5A880] font-semibold border border-[#C5A880]/30">
                            {tech.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                          {tech.desc}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#0C1427] bg-[#0C1427]' : 'border-zinc-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Placement Position */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#0C1427] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0C1427] text-white text-[10px] flex items-center justify-center">3</span>
                  Placement Position
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  'Left Chest (Classic Monogram)',
                  'Center Chest (Artistic Headline)',
                  'Upper Back / Yoke',
                  'Sleeve Cuff Subtle Accent',
                ].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPlacementPosition(pos)}
                    className={`p-2.5 text-center text-[11px] uppercase tracking-wider border transition-colors ${
                      placementPosition === pos
                        ? 'border-[#0C1427] bg-[#0C1427] text-white font-semibold'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Colourway & Fabric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-2">
                  Garment Colourway: <span className="text-zinc-500 font-normal">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {COLORWAYS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor.name === c.name ? 'border-[#C5A880] scale-110 shadow-md ring-2 ring-[#0C1427]' : 'border-zinc-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-2">
                  Volume &amp; Scale Tier
                </label>
                <select
                  value={selectedTier.id}
                  onChange={(e) => {
                    const found = QUANTITY_TIERS.find((t) => t.id === e.target.value);
                    if (found) setSelectedTier(found);
                  }}
                  className="w-full border border-zinc-300 p-2.5 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                >
                  {QUANTITY_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  {selectedTier.discountText}
                </p>
              </div>
            </div>

            {/* Step 5: Custom Artwork Brief & Patron Details */}
            <div className="space-y-4 pt-2 border-t border-zinc-200">
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-1.5">
                  Custom Artwork, Monogram Text, or Brief *
                </label>
                <textarea
                  rows={3}
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  placeholder="e.g. Please embroider monogram 'SF' in gold Madeira thread on left chest, or describe company logo details and sizes required (e.g. 5x M, 10x L)..."
                  className="w-full border border-zinc-300 p-3 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full border border-zinc-300 p-2.5 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-1">
                    Phone or WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 8310246790"
                    className="w-full border border-zinc-300 p-2.5 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Dossier & WhatsApp Trigger (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
                    Atelier Custom Dossier
                  </span>
                  <h3 className="font-serif text-2xl text-[#0C1427] font-medium mt-0.5">
                    {selectedSilhouette.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Est. Unit Price</span>
                  <span className="font-serif text-2xl text-[#0C1427] font-semibold">
                    ₹{estimatedUnitPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Garment Preview Visual */}
              <div className="relative h-48 w-full bg-zinc-900 overflow-hidden border border-zinc-200 group">
                <img
                  src={getDynamicPreviewImage()}
                  alt={selectedSilhouette.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white space-y-0.5">
                    <p className="text-xs font-serif font-medium">{selectedSilhouette.name}</p>
                    <p className="text-[10px] text-zinc-300 tracking-wider">
                      Colour: {selectedColor.name} • {selectedSilhouette.gsm}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Specifications Checklist */}
              <div className="space-y-2.5 text-xs border-y border-zinc-100 py-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Technique:</span>
                  <span className="font-medium text-[#0C1427] text-right">{selectedTechnique.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Placement:</span>
                  <span className="font-medium text-[#0C1427] text-right">{placementPosition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Fabric Grade:</span>
                  <span className="font-medium text-[#0C1427] text-right">{selectedFabric.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Volume Tier:</span>
                  <span className="font-medium text-[#0C1427] text-right">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Volume Privilege:</span>
                  <span>{selectedTier.discountText}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleOrderWhatsApp}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp (8310246790)</span>
                </button>

                <button
                  type="button"
                  onClick={handleEnquirySubmit}
                  className="w-full py-3 bg-[#0C1427] hover:bg-[#1E293B] text-[#C5A880] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Atelier Callback</span>
                </button>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 text-zinc-600 text-[11px] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Our Master Tailor reviews every digital mock-up proof with you via WhatsApp before cutting and embroidery begins.
                </span>
              </div>
            </div>

            {/* Direct Telephone Contact Card */}
            <div className="bg-[#0C1427] text-white p-6 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[#C5A880]">
                <Phone className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-[0.25em]">Direct Atelier Line</span>
              </div>
              <p className="font-serif text-2xl text-white font-normal">
                {CONCIERGE_PHONE_DISPLAY}
              </p>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Prefer speaking with our bespoke garment technologist directly? Call now for immediate quotations, fabric swatches, or corporate volume inquiries.
              </p>
              <div className="pt-2">
                <a
                  href={`tel:+${CONCIERGE_PHONE_RAW}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A880] hover:text-white font-semibold luxury-underline-gold"
                >
                  <span>Tap to Call +91 8310246790</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white border border-zinc-200 p-6 sm:p-12 shadow-xl space-y-8">
            <div className="border-b border-zinc-200 pb-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
                Custom Product Studio
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#0C1427] font-normal mt-1">
                Request a Custom T-Shirt or New Design
              </h3>
              <p className="text-xs text-zinc-500 font-light mt-2 leading-relaxed">
                We exclusively produce premium T-shirts in bespoke cuts, special colorways, and custom graphics. Share your vision below or connect with our master atelier directly on WhatsApp.
              </p>
            </div>

            {/* 1. Silhouette / Cut */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-2.5">
                1. Select Preferred T-Shirt Cut / Silhouette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Classic Supima Crew Neck',
                  'Heavyweight Boxy Drop-Shoulder',
                  'Mercerized Piqué Polo',
                  'Mineral Washed Vintage Tee',
                  'Architectural Mock-Neck',
                  'Custom Silhouette / Cut',
                ].map((sil) => (
                  <button
                    key={sil}
                    type="button"
                    onClick={() => setReqSilhouette(sil)}
                    className={`p-3 text-left border text-xs transition-all ${
                      reqSilhouette === sil
                        ? 'border-[#0C1427] bg-[#0C1427] text-white font-medium shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {sil}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Colorway & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-2.5">
                  2. Preferred Colorway
                </label>
                <select
                  value={reqColor}
                  onChange={(e) => setReqColor(e.target.value)}
                  className="w-full border border-zinc-300 p-3 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                >
                  <option value="Pitch Black">Pitch Black (Onyx)</option>
                  <option value="Chalk White">Chalk White</option>
                  <option value="Midnight Navy">Midnight Navy</option>
                  <option value="Tuscan Olive">Tuscan Olive</option>
                  <option value="Desert Dune Sand">Desert Dune Sand / Ecru</option>
                  <option value="Bordeaux Wine">Bordeaux Wine / Maroon</option>
                  <option value="Heather Charcoal Grey">Heather Charcoal Grey</option>
                  <option value="Custom Pantone Color">Custom Pantone Color (Specify in Brief)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-2.5">
                  3. Expected Quantity
                </label>
                <select
                  value={reqQuantity}
                  onChange={(e) => setReqQuantity(e.target.value)}
                  className="w-full border border-zinc-300 p-3 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                >
                  <option value="1-5 Pieces (Sample / Single Bespoke)">1-5 Pieces (Sample / Single Bespoke)</option>
                  <option value="10-25 Pieces (Small Batch)">10-25 Pieces (Small Batch)</option>
                  <option value="25-50 Pieces (Club / Studio)">25-50 Pieces (Club / Studio)</option>
                  <option value="50-200 Pieces (Corporate / Fest)">50-200 Pieces (Corporate / Fest)</option>
                  <option value="200+ Pieces (Enterprise Wholesale)">200+ Pieces (Enterprise Wholesale)</option>
                </select>
              </div>
            </div>

            {/* 3. Technique */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-2.5">
                4. Preferred Craft Technique
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  'Metallic Embroidery',
                  '3D Puff Screen Print',
                  'Water-Based Silkscreen',
                  'Ultra-HD DTG Print',
                ].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setReqTechnique(tech)}
                    className={`p-2.5 text-center text-[11px] uppercase tracking-wider border transition-colors ${
                      reqTechnique === tech
                        ? 'border-[#0C1427] bg-[#0C1427] text-white font-semibold'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Design Brief Description */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-1.5">
                5. Describe Your T-Shirt Design Concept or Request *
              </label>
              <textarea
                rows={4}
                value={reqDesignBrief}
                onChange={(e) => setReqDesignBrief(e.target.value)}
                placeholder="Describe your design in detail: graphics, text, logo placement, typography styles, sizes needed, or any special fabric weight preferences..."
                className="w-full border border-zinc-300 p-3 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
              />
            </div>

            {/* 5. Reference Mockup Link */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-1.5">
                6. Reference Artwork / Mockup Link (Optional)
              </label>
              <input
                type="url"
                value={reqReferenceLink}
                onChange={(e) => setReqReferenceLink(e.target.value)}
                placeholder="e.g. Google Drive link, Figma, Pinterest, or image URL"
                className="w-full border border-zinc-300 p-3 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
              />
            </div>

            {/* 6. Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-200">
              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={reqCustomerName}
                  onChange={(e) => setReqCustomerName(e.target.value)}
                  placeholder="e.g. Alexander Wright"
                  className="w-full border border-zinc-300 p-2.5 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-widest text-[#0C1427] mb-1">
                  Phone or WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={reqCustomerPhone}
                  onChange={(e) => setReqCustomerPhone(e.target.value)}
                  placeholder="e.g. 8310246790"
                  className="w-full border border-zinc-300 p-2.5 text-xs text-[#0C1427] bg-white focus:outline-none focus:border-[#0C1427]"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleCustomRequestWhatsApp}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2.5 transition-all shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Request to WhatsApp (8310246790)</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-50 border border-zinc-200 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0C1427]" />
                  <span className="text-zinc-600">Need instant atelier consultation?</span>
                </div>
                <a
                  href="tel:+918310246790"
                  className="font-bold text-black hover:text-zinc-600 transition-colors luxury-link"
                >
                  <span>Call Master Tailor: +91 8310246790</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Bespoke Craftsmanship Showcase Lookbook */}
      <section className="bg-[#0C1427] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
              The Craftsmanship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mt-1 mb-3">
              Precision Needling &amp; Master Finishes
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Every custom order is treated as a piece of haute confection. We use identical materials, pre-shrunk bio-washes, and luxury single-needle hems found in our ready-to-wear archive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 group">
              <div className="relative h-72 w-full overflow-hidden bg-zinc-900 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
                  alt="Fine embroidery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif text-lg text-white">Metallic &amp; Silk Embroidery</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                40,000-stitch high-density needlework using German Madeira threads that never fray or tarnish during laundering.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="relative h-72 w-full overflow-hidden bg-zinc-900 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop"
                  alt="High-density silkscreen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif text-lg text-white">Archival Japanese Pigment Print</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Permeates deep into the cotton fibers for a silky, zero-hand touch that remains ultra-breathable even on large graphics.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="relative h-72 w-full overflow-hidden bg-zinc-900 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop"
                  alt="Executive Packaging"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif text-lg text-white">White-Glove Presentation</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Each bespoke garment is individually pressed, wrapped in acid-free tissue paper, and packaged in our signature ribboned rigid presentation box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four-Stage Bespoke Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
            The Journey
          </span>
          <h2 className="font-serif text-3xl text-[#0C1427] mt-1">
            How Your Custom Order Unfolds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Design Consultation',
              desc: 'Share your artwork, monogram initials, or company logo with our concierge on WhatsApp (8310246790).',
            },
            {
              step: '02',
              title: 'Digital Proof in 24h',
              desc: 'Our graphic atelier prepares exact 3D render mockups showcasing scale, Pantone color matching, and placement.',
            },
            {
              step: '03',
              title: 'Precision Crafting',
              desc: 'Garments are cut, embroidered, printed, and quality inspected with meticulous attention to stitch tolerance.',
            },
            {
              step: '04',
              title: 'White-Glove Dispatch',
              desc: 'Dispatched via premium express air courier with real-time airway bill tracking sent directly to your phone.',
            },
          ].map((item) => (
            <div key={item.step} className="p-6 bg-white border border-zinc-200 relative group hover:border-[#C5A880] transition-colors">
              <span className="font-serif text-4xl text-zinc-200 group-hover:text-[#C5A880] transition-colors block font-light mb-4">
                {item.step}
              </span>
              <h4 className="font-serif text-lg text-[#0C1427] font-medium mb-2">{item.title}</h4>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Custom Orders FAQ */}
      <section className="bg-zinc-50 border-t border-zinc-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
              Atelier Guidance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0C1427]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-zinc-200 bg-white border border-zinc-200 p-6 sm:p-8 space-y-6">
            <div className="pt-2 space-y-1.5">
              <h4 className="font-serif text-base text-[#0C1427] font-medium">
                What is the minimum order quantity for custom T-shirts?
              </h4>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                We accept single-piece personal bespoke commissions (1 T-shirt) for monogram embroidery and digital printing. For corporate screen prints and custom-woven label runs, volume pricing begins at 10 pieces.
              </p>
            </div>

            <div className="pt-6 space-y-1.5">
              <h4 className="font-serif text-base text-[#0C1427] font-medium">
                How quickly can my custom order be delivered?
              </h4>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                Sample orders and small runs (1-20 pieces) are tailored and dispatched within 3 to 5 business days. Express rush production is available upon request through our hotline at +91 8310246790.
              </p>
            </div>

            <div className="pt-6 space-y-1.5">
              <h4 className="font-serif text-base text-[#0C1427] font-medium">
                What file formats should I send for my logo or design?
              </h4>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                We welcome vector files (AI, EPS, SVG, or high-res PDF). If you only have a JPG/PNG or a sketch idea, our studio designers will vectorize and optimize your artwork at zero additional fee.
              </p>
            </div>

            <div className="pt-6 space-y-1.5">
              <h4 className="font-serif text-base text-[#0C1427] font-medium">
                Can I order physical fabric swatches or a blank sample first?
              </h4>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                Yes! We can dispatch a curated fabric swatch book and blank sample sizing kit to your office or residence anywhere in India. Reach out on WhatsApp at 8310246790 to coordinate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
