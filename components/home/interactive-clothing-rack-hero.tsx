'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  X,
  Check,
  RotateCw,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import { CONCIERGE_PHONE, CONCIERGE_PHONE_DISPLAY } from '@/lib/whatsapp';

export interface RackGarment {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  colorName: string;
  colorHex: string;
  fabric: string;
  price: number;
  compareAtPrice: number;
  badge: string;
  description: string;
  fixtureFolder: string;
  motionManifest: string;
  atlasUrl: string;
  profileUrl: string;
  frontUrl: string;
  backUrl: string;
}

const RACK_GARMENTS: RackGarment[] = [
  {
    id: 'rack-hoodie',
    slug: 'heavyweight-boxy-hoodie',
    title: 'Biella Heavyweight Boxy Hoodie',
    subtitle: '400 GSM Compact French Terry',
    colorName: 'Charcoal Noir',
    colorHex: '#18181B',
    fabric: '100% Organic French Terry Cotton',
    price: 3499,
    compareAtPrice: 4999,
    badge: 'AUTUMN / WINTER 26',
    description: 'Ultra-dense 400 GSM brushed loopback fleece with an architectural drop-shoulder cut, double-layered hood, and clean cuff articulation.',
    fixtureFolder: 'hoodie',
    motionManifest: '/fixtures/rack/hoodie/manifest.json',
    atlasUrl: '/fixtures/rack/hoodie/atlas.webp',
    profileUrl: '/fixtures/rack/hoodie/profile.webp',
    frontUrl: '/fixtures/rack/hoodie/front.webp',
    backUrl: '/fixtures/rack/hoodie/back.webp',
  },
  {
    id: 'rack-lake-white',
    slug: 'sovereign-supima-crew-t-shirt',
    title: 'Sovereign Supima® Alpine Tee',
    subtitle: '190 GSM Extra-Long Staple Cotton',
    colorName: 'Chalk White',
    colorHex: '#FAFAFA',
    fabric: '100% American Supima® Cotton',
    price: 2199,
    compareAtPrice: 2999,
    badge: 'FLAGSHIP CLASSIC',
    description: 'The gold standard of luxury drape with anti-curl collar and micro-gauge combed fibers for unmatched silk-like hand feel.',
    fixtureFolder: 'lake-white-v3',
    motionManifest: '/fixtures/rack/lake-white-v3/manifest.json',
    atlasUrl: '/fixtures/rack/lake-white-v3/atlas.webp',
    profileUrl: '/fixtures/rack/lake-white-v3/profile.webp',
    frontUrl: '/fixtures/rack/lake-white-v3/front.webp',
    backUrl: '/fixtures/rack/lake-white-v3/back.webp',
  },
  {
    id: 'rack-crew',
    slug: 'biella-heavyweight-boxy-tee',
    title: 'Architectural Compact Crewneck',
    subtitle: '340 GSM Heavyweight French Jersey',
    colorName: 'Obsidian Black',
    colorHex: '#121214',
    fabric: 'Pre-Shrunk Compact Cotton Jersey',
    price: 2899,
    compareAtPrice: 3999,
    badge: 'LIMITED EDITION',
    description: 'Engineered boxy silhouette with reinforced ribbed collar and seamless shoulder slope designed to maintain its form through years of wear.',
    fixtureFolder: 'crew',
    motionManifest: '/fixtures/rack/crew/manifest.json',
    atlasUrl: '/fixtures/rack/crew/atlas.webp',
    profileUrl: '/fixtures/rack/crew/profile.webp',
    frontUrl: '/fixtures/rack/crew/front.webp',
    backUrl: '/fixtures/rack/crew/back.webp',
  },
  {
    id: 'rack-cards-pink',
    slug: 'verona-mineral-washed-boxy-tee',
    title: 'Verona Mineral Washed Boxy Tee',
    subtitle: '280 GSM Mineral Stone Wash',
    colorName: 'Dusty Rose',
    colorHex: '#E2B8B8',
    fabric: 'Pumice Stone Washed Cotton',
    price: 2299,
    compareAtPrice: 3199,
    badge: 'NEW DROP',
    description: 'Artisanal stone-washed heavyweight jersey featuring dual line-art graphic insignias with relaxed drape and zero fade after commercial laundry.',
    fixtureFolder: 'cards-pink-v3',
    motionManifest: '/fixtures/rack/cards-pink-v3/manifest.json',
    atlasUrl: '/fixtures/rack/cards-pink-v3/atlas.webp',
    profileUrl: '/fixtures/rack/cards-pink-v3/profile.webp',
    frontUrl: '/fixtures/rack/cards-pink-v3/front.webp',
    backUrl: '/fixtures/rack/cards-pink-v3/back.webp',
  },
  {
    id: 'rack-tee',
    slug: 'custom-bespoke-atelier-embroidered-tee',
    title: 'Signature Atelier Graphic Tee',
    subtitle: '240 GSM Combed Streetwear Knit',
    colorName: 'Vintage Washed Noir',
    colorHex: '#27272A',
    fabric: '100% Combed Compact Cotton',
    price: 1999,
    compareAtPrice: 2699,
    badge: 'CURATED BESTSELLER',
    description: 'Clean streetwear silhouette with high-density screen print and metallic Madeira embroidery detail at the hem.',
    fixtureFolder: 'tee',
    motionManifest: '/fixtures/rack/tee/manifest.json',
    atlasUrl: '/fixtures/rack/tee/atlas.webp',
    profileUrl: '/fixtures/rack/tee/profile.webp',
    frontUrl: '/fixtures/rack/tee/front.webp',
    backUrl: '/fixtures/rack/tee/back.webp',
  },
];

// --- Physics Engine & Layout Algorithms ---

function rackPositions({
  count,
  width,
  garmentWidth,
  active = -1,
  profileHalfRatio = 0.08,
  frontHalfRatio = 0.43,
  minimumSpread = 0,
}: {
  count: number;
  width: number;
  garmentWidth: number;
  active?: number;
  profileHalfRatio?: number;
  frontHalfRatio?: number;
  minimumSpread?: number;
}) {
  const pitch = width / count;
  const rest = Array.from({ length: count }, (_, i) => (i + 0.5) * pitch);
  if (active < 0 || active >= count || count === 1) return rest;

  const profileHalf = garmentWidth * profileHalfRatio;
  const gap = garmentWidth * (frontHalfRatio + profileHalfRatio) + 16;
  const center = rest[active];
  const positions = [...rest];

  for (const direction of [-1, 1]) {
    const n = direction < 0 ? active : count - active - 1;
    if (!n) continue;
    const room = direction < 0 ? center - profileHalf : width - profileHalf - center;
    const separation = Math.min(Math.max(gap, pitch + minimumSpread), room);
    const neighborPitch = n > 1 ? Math.min(pitch, (room - separation) / (n - 1)) : pitch;
    for (let j = 1; j <= n; j++) {
      positions[active + direction * j] = center + direction * (separation + (j - 1) * neighborPitch);
    }
  }
  return positions;
}

function slideStep(position: number, velocity: number, target: number, deltaMs: number, omega = 18) {
  const dt = Math.min(deltaMs, 50) / 1000;
  const offset = position - target;
  const term = velocity + omega * offset;
  const decay = Math.exp(-omega * dt);
  const next = target + (offset + term * dt) * decay;
  const nextVelocity = (velocity - omega * term * dt) * decay;
  if (Math.abs(next - target) < 0.04 && Math.abs(nextVelocity) < 0.25) {
    return { position: target, velocity: 0 };
  }
  return { position: next, velocity: nextVelocity };
}

class GarmentController {
  frameCount: number;
  durationMs: number;
  returnDurationMs: number;
  onFrame: (frame: number) => void;
  position = 0;
  target = 0;
  frame = 0;
  velocity = 0;
  segment: { kind: 'brake' | 'turn'; start: number; velocity: number; duration: number; elapsed: number } | null = null;

  constructor({
    frameCount = 30,
    durationMs = 380,
    returnDurationMs = 300,
    onFrame = () => {},
  }: {
    frameCount?: number;
    durationMs?: number;
    returnDurationMs?: number;
    onFrame?: (frame: number) => void;
  } = {}) {
    this.frameCount = frameCount;
    this.durationMs = durationMs;
    this.returnDurationMs = returnDurationMs;
    this.onFrame = onFrame;
  }

  setTarget(target: 0 | 1, immediate = false) {
    if (immediate) {
      this.target = target;
      this.position = target;
      this.velocity = 0;
      this.segment = null;
      this.render();
      return;
    }
    if (target === this.target) return;
    this.target = target;

    if (this.velocity * (target - this.position) < 0) {
      const room = this.velocity > 0 ? 1 - this.position : this.position;
      const duration = Math.min(32, (2 * room) / Math.abs(this.velocity));
      this.segment = { kind: 'brake', start: this.position, velocity: this.velocity, duration, elapsed: 0 };
    } else {
      this.tween();
    }
  }

  tween() {
    const distance = Math.abs(this.target - this.position);
    if (distance < 1e-9) {
      this.position = this.target;
      this.velocity = 0;
      this.segment = null;
      return;
    }
    const full = this.target === 1 ? this.durationMs : this.returnDurationMs;
    let duration = Math.max(80, full * Math.sqrt(distance));
    if (this.velocity) duration = Math.min(duration, (3 * distance) / Math.abs(this.velocity));
    this.segment = { kind: 'turn', start: this.position, velocity: this.velocity, duration, elapsed: 0 };
  }

  step(deltaMs: number): boolean {
    let remaining = Math.min(deltaMs, 50);
    while (this.segment && remaining > 0) {
      const s = this.segment;
      const dt = Math.min(remaining, s.duration - s.elapsed);
      s.elapsed += dt;
      remaining -= dt;
      const t = s.duration ? s.elapsed / s.duration : 1;
      if (s.kind === 'brake') {
        this.position = s.start + s.velocity * s.duration * (t - (t * t) / 2);
        this.velocity = s.velocity * (1 - t);
      } else {
        const delta = this.target - s.start;
        const tangent = s.velocity * s.duration;
        this.position = s.start + delta * (3 * t * t - 2 * t * t * t) + tangent * (t * t * t - 2 * t * t + t);
        this.velocity = (delta * (6 * t - 6 * t * t) + tangent * (3 * t * t - 4 * t + 1)) / s.duration;
      }
      this.position = Math.max(0, Math.min(1, this.position));
      if (s.elapsed >= s.duration) {
        this.velocity = 0;
        if (s.kind === 'brake') this.tween();
        else {
          this.position = this.target;
          this.segment = null;
        }
      }
    }
    this.render();
    return Boolean(this.segment);
  }

  render() {
    const next = Math.round(this.position * (this.frameCount - 1));
    if (next !== this.frame) {
      this.frame = next;
      this.onFrame(next);
    }
  }
}

interface GarmentState {
  item: RackGarment;
  controller: GarmentController;
  position: number;
  velocity: number;
  displayWidth: number;
  image: HTMLImageElement | null;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  isReady: boolean;
}

export function InteractiveClothingRackHero() {
  const rackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const statesRef = useRef<GarmentState[]>([]);
  const { addToCart, setIsCartOpen } = useCart();
  const { success } = useToast();

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectViewSide, setInspectViewSide] = useState<'front' | 'back'>('front');
  const [inspectSelectedSize, setInspectSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('L');
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const intentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingIndexRef = useRef<number>(-1);
  const railOffsetRef = useRef<number>(0);
  const railVelocityRef = useRef<number>(0);
  const dragRef = useRef<{ id: number; startX: number; lastX: number; lastTime: number; velocity: number; horizontal: boolean } | null>(null);

  // Initialize Canvas and Sprite Controllers
  useEffect(() => {
    const states: GarmentState[] = RACK_GARMENTS.map((item) => {
      const state: GarmentState = {
        item,
        controller: new GarmentController({
          frameCount: 30,
          durationMs: 380,
          returnDurationMs: 300,
          onFrame: (frame: number) => {
            if (!state.ctx || !state.image) return;
            const w = 384;
            const h = 448;
            const columns = 6;
            const col = frame % columns;
            const row = Math.floor(frame / columns);
            state.ctx.clearRect(0, 0, w, h);
            state.ctx.drawImage(state.image, col * w, row * h, w, h, 0, 0, w, h);
          },
        }),
        position: 0,
        velocity: 0,
        displayWidth: 370,
        image: null,
        canvas: null,
        ctx: null,
        isReady: false,
      };
      return state;
    });

    statesRef.current = states;

    // Preload atlases and wire canvas
    let loadedCount = 0;
    states.forEach((s) => {
      const img = new window.Image();
      img.src = s.item.atlasUrl;
      img.onload = () => {
        s.image = img;
        s.isReady = true;
        // Paint initial frame (frame 0 = profile)
        if (s.ctx) {
          s.ctx.clearRect(0, 0, 384, 448);
          s.ctx.drawImage(img, 0, 0, 384, 448, 0, 0, 384, 448);
        }
        loadedCount++;
        if (loadedCount >= states.length) {
          setIsAssetsLoaded(true);
        }
      };
    });

    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    };
  }, []);

  const wake = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(function loop(time) {
        const dt = lastTimeRef.current ? Math.min(50, time - lastTimeRef.current) : 0;
        lastTimeRef.current = time;

        const rackEl = rackRef.current;
        if (!rackEl) {
          rafRef.current = 0;
          return;
        }

        const width = rackEl.clientWidth;
        const count = statesRef.current.length;
        const currentActive = pendingIndexRef.current >= 0 ? pendingIndexRef.current : -1;
        const garmentWidth = window.innerWidth >= 1400 ? 400 : window.innerWidth < 768 ? 315 : 370;

        let moving = false;

        // Step garment rotation controller
        for (const s of statesRef.current) {
          const isControllerMoving = s.controller.step(dt);
          moving = isControllerMoving || moving;
        }

        // Target slide positions
        const targetPositions = rackPositions({
          count,
          width,
          garmentWidth,
          active: currentActive,
          minimumSpread: window.innerWidth < 768 ? 20 : 38,
        });

        // Spring step garment positions along the rail
        statesRef.current.forEach((s, i) => {
          const next = slideStep(s.position, s.velocity, targetPositions[i], dt, currentActive < 0 ? 20 : 18);
          s.position = next.position;
          s.velocity = next.velocity;
          moving = moving || Math.abs(s.position - targetPositions[i]) > 0.05 || Math.abs(s.velocity) > 0.3;

          const button = document.getElementById(`garment-btn-${i}`);
          if (button) {
            button.style.left = `${s.position}px`;
          }
        });

        if (moving) {
          rafRef.current = requestAnimationFrame(loop);
        } else {
          rafRef.current = 0;
          lastTimeRef.current = 0;
        }
      });
    }
  }, []);

  const activate = useCallback(
    (index: number) => {
      pendingIndexRef.current = index;
      setActiveIndex(index);
      if (index >= 0) {
        setSelectedIndex(index);
      }

      statesRef.current.forEach((s, i) => {
        s.controller.setTarget(i === index ? 1 : 0);
      });
      wake();
    },
    [wake]
  );

  const intend = useCallback(
    (index: number) => {
      if (intentTimerRef.current) {
        clearTimeout(intentTimerRef.current);
        intentTimerRef.current = null;
      }
      if (index < 0) {
        activate(-1);
        return;
      }
      intentTimerRef.current = setTimeout(() => {
        activate(index);
      }, 70);
    },
    [activate]
  );

  // Setup initial layout positions
  useEffect(() => {
    const handleLayout = () => {
      const rackEl = rackRef.current;
      if (!rackEl || !statesRef.current.length) return;
      const width = rackEl.clientWidth;
      const count = statesRef.current.length;
      const garmentWidth = window.innerWidth >= 1400 ? 400 : window.innerWidth < 768 ? 315 : 370;

      const pos = rackPositions({ count, width, garmentWidth, active: -1 });
      statesRef.current.forEach((s, i) => {
        s.position = pos[i];
        s.velocity = 0;
        s.displayWidth = garmentWidth;
        const button = document.getElementById(`garment-btn-${i}`);
        if (button) {
          button.style.left = `${s.position}px`;
        }
      });
      wake();
    };

    handleLayout();
    window.addEventListener('resize', handleLayout);
    return () => window.removeEventListener('resize', handleLayout);
  }, [wake]);

  // Pointer Movement across Rack
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobileDevice) return;
    const rackEl = rackRef.current;
    if (!rackEl) return;
    const rect = rackEl.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let nearest = -1;
    let minDiff = Infinity;
    statesRef.current.forEach((s, i) => {
      const diff = Math.abs(x - s.position);
      const threshold = i === activeIndex ? s.displayWidth * 0.45 : 35;
      if (diff <= threshold && diff < minDiff) {
        nearest = i;
        minDiff = diff;
      }
    });

    intend(nearest);
  };

  const handlePointerLeave = () => {
    if (isMobileDevice) return;
    intend(-1);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % RACK_GARMENTS.length;
    activate(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (selectedIndex - 1 + RACK_GARMENTS.length) % RACK_GARMENTS.length;
    activate(prevIdx);
  };

  const activeGarment = RACK_GARMENTS[selectedIndex] || RACK_GARMENTS[0];

  const handleQuickAdd = () => {
    addToCart(
      {
        id: `${activeGarment.id}-${inspectSelectedSize}`,
        productId: activeGarment.id,
        variantId: `var-${activeGarment.id}-${inspectSelectedSize}`,
        title: activeGarment.title,
        slug: activeGarment.slug,
        price: activeGarment.price,
        compareAtPrice: activeGarment.compareAtPrice,
        colorName: activeGarment.colorName,
        colorHex: activeGarment.colorHex,
        size: inspectSelectedSize,
        imageUrl: activeGarment.frontUrl,
        maxStock: 50,
      },
      1
    );
    success('Added to Bag', `${activeGarment.title} (${inspectSelectedSize}) placed in your bag.`);
    setIsCartOpen(true);
  };

  const getWhatsAppDirectUrl = () => {
    const message = [
      `*🏛️ SHIPFOLD / STITCH — CLOTHING RACK CONCIERGE INQUIRY*`,
      `----------------------------------------`,
      `*Garment:* ${activeGarment.title}`,
      `*Silhouette / Fabric:* ${activeGarment.subtitle}`,
      `*Colourway:* ${activeGarment.colorName}`,
      `*Selected Size:* ${inspectSelectedSize}`,
      `*Price:* ₹${activeGarment.price.toLocaleString('en-IN')}`,
      `----------------------------------------`,
      `Hello Concierge, I am viewing this piece from the interactive clothing rack and would like to order or inspect swatches.`,
    ].join('\n');
    return `https://wa.me/${CONCIERGE_PHONE}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#FAF9F5] text-[#111111] overflow-hidden select-none border-b border-zinc-200"
      aria-label="Interactive Clothing Rack Hero Collection"
    >
      {/* Background Architectural Watermark Typography */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.035] z-0">
        <span className="font-serif text-[18vw] font-bold tracking-[0.2em] uppercase leading-none select-none text-black">
          STITCH
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-12">
        {/* Top Eyebrow & Headline Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#C5A880] text-[10px] uppercase font-bold tracking-[0.25em]">
              <Sparkles className="w-3 h-3 text-[#C5A880]" />
              <span>THE VIRAL INTERACTIVE ATELIER RACK</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0E0E0E] font-normal tracking-tight leading-tight">
              Autumn / Winter 2026 Collection
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-light flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isMobileDevice
                  ? 'Tap garments to rotate forward • Swipe to browse rack'
                  : 'Hover over any piece to turn forward • Click to inspect details'}
              </span>
            </p>
          </div>

          {/* Quick Counter & Atelier Hotline */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-zinc-500">
            <div className="hidden sm:block text-right">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 block font-bold">
                Direct Atelier Line
              </span>
              <a
                href={`tel:+${CONCIERGE_PHONE}`}
                className="font-mono text-xs font-semibold text-black hover:text-[#C5A880] transition-colors"
              >
                {CONCIERGE_PHONE_DISPLAY}
              </a>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 border border-zinc-200 rounded font-mono text-xs font-bold text-black">
              <span>{String(selectedIndex + 1).padStart(2, '0')}</span>
              <span className="text-zinc-400">/</span>
              <span className="text-zinc-500">{String(RACK_GARMENTS.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* 2. THE INTERACTIVE CLOTHING RACK */}
        <div
          ref={rackRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative w-full h-[470px] sm:h-[530px] lg:h-[580px] mt-6 sm:mt-10 overflow-hidden cursor-pointer"
        >
          {/* Overhead Metallic Chrome Rail */}
          <div className="absolute top-8 left-0 right-0 h-[8px] rounded-full bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-800 shadow-md border-t border-white/60 border-b border-black/40 z-0">
            {/* Rail Endcaps */}
            <div className="absolute -left-2 -top-1 w-4 h-4 rounded-full bg-zinc-800 border border-zinc-500 shadow-inner" />
            <div className="absolute -right-2 -top-1 w-4 h-4 rounded-full bg-zinc-800 border border-zinc-500 shadow-inner" />
          </div>

          {/* Garment Suspension Items Container */}
          <div className="absolute inset-0">
            {RACK_GARMENTS.map((item, idx) => {
              const isActive = idx === activeIndex;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  id={`garment-btn-${idx}`}
                  onClick={() => {
                    activate(idx);
                    setInspectModalOpen(true);
                  }}
                  className={`absolute top-8 transition-transform duration-200 ${
                    isActive ? 'z-30' : isSelected ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '480px',
                    left: '50%',
                  }}
                >
                  {/* Steel Suspension Wire & Hanger Hook */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-[34px] bg-gradient-to-b from-zinc-600 via-zinc-400 to-zinc-700 shadow-sm" />

                  {/* Canvas for 3D Spritesheet Rotation Animation */}
                  <div className="relative mt-8 flex items-center justify-center pointer-events-none">
                    <canvas
                      ref={(el) => {
                        if (el && statesRef.current[idx]) {
                          statesRef.current[idx].canvas = el;
                          statesRef.current[idx].ctx = el.getContext('2d');
                        }
                      }}
                      width={384}
                      height={448}
                      className={`w-[320px] sm:w-[370px] lg:w-[400px] h-auto object-contain transition-all duration-300 ${
                        isActive
                          ? 'drop-shadow-2xl scale-[1.03]'
                          : isSelected
                          ? 'drop-shadow-lg'
                          : 'drop-shadow-sm opacity-95'
                      }`}
                      style={{
                        transform: 'translateX(0)',
                      }}
                    />

                    {/* Preload Profile Placeholder (Smooth initial render before canvas paint) */}
                    {!isAssetsLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src={item.profileUrl}
                          alt={item.title}
                          width={384}
                          height={448}
                          priority={idx < 2}
                          className="w-[320px] sm:w-[370px] lg:w-[400px] h-auto object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Hover Floating Pill Tag */}
                  <div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 translate-y-0 bg-black text-[#C5A880] shadow-xl'
                        : isSelected
                        ? 'opacity-90 bg-zinc-900 text-white'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <span>{item.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. COLLECTION INFORMATION & INTERACTIVE CONTROLS BAR */}
        <div className="mt-4 sm:mt-6 pt-6 border-t border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Active Garment Dossier */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-white text-[9px] uppercase font-bold tracking-widest">
                {activeGarment.badge}
              </span>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                {activeGarment.subtitle}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#0E0E0E] font-normal leading-snug">
              {activeGarment.title}
            </h2>

            <p className="text-xs text-zinc-600 line-clamp-2 font-light leading-relaxed">
              {activeGarment.description}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <span className="font-serif text-xl sm:text-2xl font-bold text-black">
                ₹{activeGarment.price.toLocaleString('en-IN')}
              </span>
              {activeGarment.compareAtPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{activeGarment.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-wider">
                In Stock &bull; 24h Dispatch
              </span>
            </div>
          </div>

          {/* Action CTAs & Rack Navigation */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            {/* Prev / Next Hanger Controls */}
            <div className="flex items-center gap-1.5 border border-zinc-300 p-1 bg-white">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Garment on Rack"
                className="p-2.5 hover:bg-zinc-100 text-zinc-700 hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-zinc-200" />
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Garment on Rack"
                className="p-2.5 hover:bg-zinc-100 text-zinc-700 hover:text-black transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Inspect Modal Trigger */}
            <button
              type="button"
              onClick={() => setInspectModalOpen(true)}
              className="px-5 py-3 bg-white border border-black text-black hover:bg-zinc-100 text-xs uppercase font-bold tracking-widest flex items-center gap-2 transition-all shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Inspect Garment</span>
            </button>

            {/* Direct Add to Bag CTA */}
            <button
              type="button"
              onClick={handleQuickAdd}
              className="px-6 py-3 bg-[#0E0E0E] hover:bg-[#222222] text-white text-xs uppercase font-bold tracking-widest flex items-center gap-2.5 transition-all shadow-lg"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODAL DRAWER: INSPECT GARMENT (Front & Back View + WhatsApp Order) */}
      {inspectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black transition-colors"
              aria-label="Close Inspection Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Garment High-Res View with Front/Back Toggle */}
              <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 p-6 relative">
                <div className="relative w-full aspect-[384/448] flex items-center justify-center">
                  <Image
                    src={inspectViewSide === 'front' ? activeGarment.frontUrl : activeGarment.backUrl}
                    alt={`${activeGarment.title} - ${inspectViewSide} view`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                  />
                </div>

                {/* Front / Back Toggle Tabs */}
                <div className="mt-4 flex items-center gap-2 bg-white border border-zinc-200 p-1">
                  <button
                    type="button"
                    onClick={() => setInspectViewSide('front')}
                    className={`px-4 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors ${
                      inspectViewSide === 'front'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-zinc-600 hover:text-black'
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectViewSide('back')}
                    className={`px-4 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors ${
                      inspectViewSide === 'back'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-zinc-600 hover:text-black'
                    }`}
                  >
                    Back View
                  </button>
                </div>
              </div>

              {/* Right Column: Garment Specifications & Actions */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
                    {activeGarment.badge}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-black">
                    {activeGarment.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl font-bold text-black">
                      ₹{activeGarment.price.toLocaleString('en-IN')}
                    </span>
                    {activeGarment.compareAtPrice && (
                      <span className="text-sm text-zinc-400 line-through">
                        ₹{activeGarment.compareAtPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed font-light">
                    {activeGarment.description}
                  </p>

                  <div className="py-2 border-t border-b border-zinc-100 space-y-1.5 text-xs text-zinc-700">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Fabric Composition:</span>
                      <span className="font-medium">{activeGarment.fabric}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Colourway:</span>
                      <span className="font-medium">{activeGarment.colorName}</span>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      Select Tailored Size
                    </span>
                    <div className="flex items-center gap-2">
                      {(['S', 'M', 'L', 'XL'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setInspectSelectedSize(sz)}
                          className={`w-10 h-10 border text-xs font-bold transition-all ${
                            inspectSelectedSize === sz
                              ? 'border-black bg-black text-white shadow'
                              : 'border-zinc-300 text-zinc-700 hover:border-black'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleQuickAdd();
                      setInspectModalOpen(false);
                    }}
                    className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                    <span>Add to Bag (Size {inspectSelectedSize})</span>
                  </button>

                  <a
                    href={getWhatsAppDirectUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp (8310274918)</span>
                  </a>

                  <Link
                    href={`/product/${activeGarment.slug}`}
                    className="w-full py-2.5 text-center text-xs text-zinc-600 hover:text-black font-semibold uppercase tracking-wider block"
                  >
                    View Complete Product Dossier &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
