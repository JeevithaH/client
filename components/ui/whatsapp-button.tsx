'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, Phone } from 'lucide-react';
import { getWhatsAppConciergeUrl, CONCIERGE_PHONE_DISPLAY } from '@/lib/whatsapp';

export function WhatsAppButton({ phoneNumber = '916395463874' }: { phoneNumber?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const displayPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(customMsg || 'Hello STiTCH Concierge, I would like assistance with streetwear drops & orders.');
    const url = `https://wa.me/${cleanPhone}?text=${text}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Mini Chat */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white shadow-2xl border border-zinc-200 animate-in slide-in-from-bottom-5 duration-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0E0E0E] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-sans font-bold text-xs uppercase tracking-wider text-white">STiTCH Concierge</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{displayPhone}</span>
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF8F5] space-y-3 text-xs">
            <div className="p-3 bg-white border border-zinc-200/80 rounded-none shadow-sm space-y-1">
              <p className="text-zinc-800 font-serif leading-relaxed">
                Welcome to Shipfold. How may our concierge team assist your wardrobe curation today?
              </p>
              <p className="text-[10px] text-zinc-400 text-right">Concierge Desk</p>
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Ask about fabrics, sizing, or order on WhatsApp..."
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#0C1427] hover:bg-[#1B2541] text-white border border-[#C5A880]/50 shadow-luxury-lg transition-all transform hover:scale-105"
        aria-label="Open WhatsApp Concierge"
      >
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0C1427] animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold block leading-none">
            Concierge
          </span>
          <span className="text-xs font-serif font-medium text-white block mt-0.5">
            Order via WhatsApp
          </span>
        </div>
      </button>
    </div>
  );
}
