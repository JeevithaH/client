'use client';

import React from 'react';
import { Truck, Headphones, RotateCcw, ShieldCheck } from 'lucide-react';
import { TrustPillar } from '@/lib/types';

interface TrustPillarsProps {
  pillars?: TrustPillar[];
}

export function TrustPillars({ pillars = [] }: TrustPillarsProps) {
  const defaultPillars: TrustPillar[] = [
    {
      id: 'tp-1',
      title: 'Free Shipping',
      description: 'Free shipping on all India order or order above ₹499.00',
      icon_name: 'Truck',
      display_order: 1,
      is_active: true,
    },
    {
      id: 'tp-2',
      title: 'Support Online',
      description: 'We support customers 24/7, send questions we will solve for you immediately.',
      icon_name: 'Headphones',
      display_order: 2,
      is_active: true,
    },
    {
      id: 'tp-3',
      title: '7 DAYS RETURN',
      description: 'Simply return it within 7 days for an exchange. Please make sure items are undamaged.',
      icon_name: 'RotateCcw',
      display_order: 3,
      is_active: true,
    },
    {
      id: 'tp-4',
      title: '100% PAYMENT SECURE',
      description: 'We ensure secure payment with Gpay, Paytm, UPI, Cards & Netbanking.',
      icon_name: 'ShieldCheck',
      display_order: 4,
      is_active: true,
    },
  ];

  const activePillars = pillars.length > 0 ? pillars.filter(p => p.is_active) : defaultPillars;

  const getIcon = (iconName?: string) => {
    const norm = (iconName || '').toLowerCase();
    if (norm.includes('truck')) return <Truck className="w-6 h-6 text-[#0E0E0E]" />;
    if (norm.includes('headphone') || norm.includes('support')) return <Headphones className="w-6 h-6 text-[#0E0E0E]" />;
    if (norm.includes('rotate') || norm.includes('return')) return <RotateCcw className="w-6 h-6 text-[#0E0E0E]" />;
    return <ShieldCheck className="w-6 h-6 text-[#0E0E0E]" />;
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {activePillars.map((pillar) => (
            <div
              key={pillar.id}
              className="flex items-start gap-4 p-4 rounded-xs border border-zinc-100 hover:border-zinc-300 transition-all bg-zinc-50/50"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(pillar.icon || pillar.icon_name)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E0E0E]">
                  {pillar.title}
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                  {pillar.subtitle || pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
