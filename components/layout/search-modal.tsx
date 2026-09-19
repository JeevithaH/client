'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Suggestion {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  imageUrl: string;
}

const TRENDING_TAGS = ['t-shirt', 'hoodie', 'oversized t-shirt', 'polo t-shirts', 'anime', 'sweatshirt'];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.suggestions || []);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0C1427]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border-b border-zinc-200 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Curated Search
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mt-4 flex items-center">
            <Search className="w-6 h-6 text-zinc-400 absolute left-0 ml-1" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by fabric, fit, style (e.g. Supima, Polo, Giza Cotton)..."
              className="w-full pl-10 pr-12 py-3 text-lg sm:text-xl font-serif text-zinc-900 placeholder-zinc-400 border-none outline-none focus:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-zinc-400 hover:text-zinc-700 uppercase tracking-widest"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-sm shadow-xl p-6 border border-zinc-100 min-h-[300px]">
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-sm animate-pulse font-serif">
              Searching the Shipfold archive...
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-4">
                Found {results.length} Masterpiece{results.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 p-3 hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#C5A880]/30"
                  >
                    <div className="relative w-16 h-20 bg-zinc-100 shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">No image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-medium block">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-zinc-900 truncate group-hover:text-[#0C1427]">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-zinc-900">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.compareAtPrice && (
                          <span className="text-[11px] text-zinc-400 line-through">
                            ₹{item.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ) : query.trim() ? (
            <div className="py-12 text-center">
              <p className="font-serif text-lg text-zinc-800">No tailored pieces matched &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-500 mt-1">Try exploring our signature categories below</p>
            </div>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-3">
                Trending Inquiries
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 bg-zinc-50 hover:bg-[#FAF8F5] border border-zinc-200 hover:border-[#C5A880] text-zinc-700 transition-colors tracking-wide"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-3">
                  Signature Collections
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Luxury Polos', href: '/shop?category=polos' },
                    { label: 'Supima Crew Necks', href: '/shop?category=crew-neck' },
                    { label: 'Mercerized Henleys', href: '/shop?category=henleys' },
                    { label: 'Relaxed & Oversized', href: '/shop?category=oversized' },
                  ].map((col) => (
                    <Link
                      key={col.label}
                      href={col.href}
                      onClick={onClose}
                      className="p-3 text-center border border-zinc-200 hover:border-[#0C1427] text-xs font-medium tracking-wide text-zinc-800 hover:text-black transition-all bg-white hover:bg-zinc-50"
                    >
                      {col.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
