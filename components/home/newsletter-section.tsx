'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/context/toast-context';

export function NewsletterSection() {
  const { success } = useToast();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    success('Privilege Registered', 'Welcome to the House of Shipfold.');
  };

  return (
    <section className="py-24 bg-[#0E0E0E] text-white">
      <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
        <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 font-medium">
          Newsletter
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-white">
          The House of Shipfold
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
          Subscribe to receive private invitations, seasonal previews, and an inaugural 10% privilege savings.
        </p>

        {joined ? (
          <div className="p-4 border border-zinc-700 text-center space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-white">
              <Check className="w-4 h-4" />
              <span className="font-sans text-xs uppercase tracking-[0.2em] font-medium">Privilege Confirmed</span>
            </div>
            <p className="text-xs text-zinc-400">
              Apply code <strong className="text-white font-mono tracking-widest">SHIP10</strong> at checkout for 10% savings.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 max-w-md mx-auto">
            <div className="relative flex items-center border-b border-zinc-700 focus-within:border-white transition-colors pb-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none tracking-wider"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="text-white hover:opacity-70 transition-opacity pl-3"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <p className="text-[11px] text-zinc-500 font-light pt-2">
          By subscribing, you agree to our Privacy Policy and Client Terms.
        </p>
      </div>
    </section>
  );
}
