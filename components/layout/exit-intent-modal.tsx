'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/context/toast-context';

interface ExitIntentModalProps {
  enabled?: boolean;
  couponCode?: string;
  headline?: string;
}

export function ExitIntentModal({
  enabled = true,
  couponCode = 'STITCH10',
  headline = 'Wait! Take 10% Off Your First Streetwear Drop',
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    if (!enabled) return;
    const hasSeen = sessionStorage.getItem('stitch_exit_intent_seen');
    if (hasSeen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15) {
        setIsOpen(true);
        sessionStorage.setItem('stitch_exit_intent_seen', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [enabled]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    success('Privilege Unlocked', `Coupon ${couponCode} copied to clipboard!`);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 text-center">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#0E0E0E] text-white mx-auto flex items-center justify-center mb-4 shadow-sm">
          <Sparkles className="w-6 h-6 text-[#EAB308]" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Before You Leave
        </span>
        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#0E0E0E] mt-1 font-sans">
          {headline}
        </h3>
        <p className="text-xs text-zinc-500 font-light mt-2 leading-relaxed">
          Use code at checkout to unlock an instant 10% privilege discount on all hoodies, t-shirts, and anime drops.
        </p>

        {/* Coupon Code Box */}
        <div className="mt-5 p-3 bg-zinc-50 border border-dashed border-zinc-300 flex items-center justify-between">
          <span className="font-mono text-sm font-bold tracking-widest text-[#0E0E0E]">
            {couponCode}
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-1.5 bg-[#0E0E0E] text-white hover:bg-zinc-800 text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 rounded-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="w-full mt-4 py-3 bg-[#0E0E0E] hover:bg-zinc-800 text-white text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
