'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HeroSlide } from '@/lib/types';

interface HeroSliderProps {
  slides?: HeroSlide[];
}

export function HeroSlider({ slides = [] }: HeroSliderProps) {
  const defaultSlides: HeroSlide[] = [
    {
      id: 'slide-1',
      title: 'New Arrival',
      subtitle: 'Premium Streetwear & Anime Collection 2026',
      badge_text: 'HOT DROPS',
      image_url: 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/Untitled_design_-_2024-12-27T174247.379.png?v=1737616864&width=1920',
      button_text: 'Shop Collection',
      button_link: '/collections/unique-design-clothes',
      text_alignment: 'left',
      display_order: 1,
      is_active: true,
    },
    {
      id: 'slide-2',
      title: 'High-Top Design',
      subtitle: 'Exclusive Heavyweight Anime & Graphic Hoodies',
      badge_text: 'LIMITED EDITION',
      image_url: 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/Untitled_design_-_2024-12-27T173455.563.png?v=1737616950&width=1920',
      button_text: 'Shop Collection',
      button_link: '/collections/best-selling',
      text_alignment: 'center',
      display_order: 2,
      is_active: true,
    },
    {
      id: 'slide-3',
      title: 'Super Comfort',
      subtitle: 'Engineered Mercerized Cotton Polos & Tees',
      badge_text: 'SUPREME SOFTNESS',
      image_url: 'https://stitchclothes-shop.myshopify.com/cdn/shop/files/Untitled_design_83.png?v=1737617049&width=1920',
      button_text: 'Shop Collection',
      button_link: '/collections/polo-t-shirts',
      text_alignment: 'right',
      display_order: 3,
      is_active: true,
    },
  ];

  const activeSlides = slides.length > 0 ? slides.filter(s => s.is_active) : defaultSlides;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeSlides.length, isPaused]);

  if (activeSlides.length === 0) return null;
  const slide = activeSlides[current];

  const alignClass =
    slide.text_alignment === 'center'
      ? 'items-center text-center'
      : slide.text_alignment === 'right'
      ? 'items-end text-right'
      : 'items-start text-left';

  return (
    <section
      className="relative w-full min-h-[60vh] sm:min-h-[75vh] lg:min-h-[85vh] bg-[#0E0E0E] overflow-hidden flex items-center group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {activeSlides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={s.image_url}
            alt={s.title}
            fill
            priority={index === 0}
            className="object-cover object-center brightness-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-16">
        <div className={`max-w-2xl flex flex-col ${alignClass} space-y-4`}>
          {slide.badge_text && (
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] rounded-full animate-in fade-in slide-in-from-bottom-2 duration-500">
              {slide.badge_text}
            </span>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans uppercase leading-tight animate-in fade-in slide-in-from-bottom-3 duration-600">
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p className="text-xs sm:text-sm lg:text-base text-zinc-200 font-light max-w-lg leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700">
              {slide.subtitle}
            </p>
          )}

          <div className="pt-2 animate-in fade-in slide-in-from-bottom-5 duration-800">
            <Link
              href={slide.button_link || '/collections/all'}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-full shadow-2xl border border-white group/btn"
            >
              <span>{slide.button_text || 'Shop Collection'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute left-4 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % activeSlides.length)}
            className="absolute right-4 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
