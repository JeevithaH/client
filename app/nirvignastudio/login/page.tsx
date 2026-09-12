'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NirvignaStudioLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/nirvignastudio');
        router.refresh();
      }
    } catch {
      setError('An error occurred during authentication');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Brand Crest */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white mb-3 font-bold text-sm tracking-wider">
            NS
          </div>
          <h1 className="font-sans text-2xl font-bold tracking-[0.2em] text-black uppercase">
            Nirvigna Studio
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-semibold mt-1">
            Private Director Portal
          </p>
        </div>

        <div className="bg-white border border-zinc-300 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-zinc-200 pb-4">
            <h2 className="font-sans text-base font-bold uppercase tracking-wider text-black">Director Sign In</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Enter authorized director credentials to manage studio operations.</p>
          </div>

          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-700 font-semibold mb-1.5">
                Director Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shipfold.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs text-black bg-white border border-zinc-300 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-700 font-semibold mb-1.5">
                Director Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs text-black bg-white border border-zinc-300 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-semibold text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? 'Verifying...' : 'Access Nirvigna Studio'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-zinc-500 hover:text-black font-medium transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
