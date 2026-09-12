'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Coupon } from '@/lib/types';

export interface CartShippingSettings {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  standardShippingFee: number;
  shippingNotice: string;
  freeShippingAllOrders?: boolean;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: Coupon | null;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  shippingSettings: CartShippingSettings;
  isFreeShippingAlways: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  refreshShippingSettings: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shipfold_luxury_cart';
const COUPON_STORAGE_KEY = 'shipfold_luxury_coupon';

const DEFAULT_SHIPPING_SETTINGS: CartShippingSettings = {
  freeShippingEnabled: true,
  freeShippingThreshold: 0,
  standardShippingFee: 0,
  shippingNotice: 'Free Delivery on all orders nationwide.',
  freeShippingAllOrders: true,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shippingSettings, setShippingSettings] = useState<CartShippingSettings>(DEFAULT_SHIPPING_SETTINGS);

  const refreshShippingSettings = async () => {
    try {
      const res = await fetch('/api/shipping-settings');
      const data = await res.json();
      if (data?.success && data?.settings) {
        setShippingSettings({
          freeShippingEnabled: Boolean(data.settings.freeShippingEnabled),
          freeShippingThreshold: Number(data.settings.freeShippingThreshold ?? 999),
          standardShippingFee: Number(data.settings.standardShippingFee ?? 150),
          shippingNotice: data.settings.shippingNotice || DEFAULT_SHIPPING_SETTINGS.shippingNotice,
          freeShippingAllOrders: Boolean(data.settings.freeShippingAllOrders || (data.settings.freeShippingEnabled && Number(data.settings.freeShippingThreshold) <= 0)),
        });
      }
    } catch (e) {
      console.warn('Could not fetch shipping settings', e);
    }
  };

  // Load shipping settings on mount
  useEffect(() => {
    refreshShippingSettings();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items, appliedCoupon, isLoaded]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.min_order_value && subtotal < appliedCoupon.min_order_value) {
      return 0;
    }
    if (appliedCoupon.discount_percent > 0) {
      return Math.round((subtotal * appliedCoupon.discount_percent) / 100);
    }
    if (appliedCoupon.discount_amount > 0) {
      return Math.min(appliedCoupon.discount_amount, subtotal);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const isFreeShippingAlways = useMemo(() => {
    return shippingSettings.freeShippingEnabled && (
      shippingSettings.freeShippingAllOrders === true ||
      shippingSettings.freeShippingThreshold <= 0
    );
  }, [shippingSettings]);

  const shippingFee = useMemo(() => {
    if (items.length === 0) return 0;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    if (shippingSettings.freeShippingEnabled) {
      if (isFreeShippingAlways || discountedSubtotal >= shippingSettings.freeShippingThreshold) {
        return 0;
      }
    }
    return Math.max(0, shippingSettings.standardShippingFee);
  }, [items.length, subtotal, discountAmount, shippingSettings, isFreeShippingAlways]);

  const total = useMemo(() => {
    const discounted = Math.max(0, subtotal - discountAmount);
    return items.length === 0 ? 0 : discounted + shippingFee;
  }, [subtotal, discountAmount, shippingFee, items.length]);

  const amountNeededForFreeShipping = useMemo(() => {
    if (isFreeShippingAlways || !shippingSettings.freeShippingEnabled) return 0;
    const discounted = Math.max(0, subtotal - discountAmount);
    return Math.max(0, shippingSettings.freeShippingThreshold - discounted);
  }, [subtotal, discountAmount, shippingSettings, isFreeShippingAlways]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && i.colorName === item.colorName
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].maxStock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }

      return [...prev, { ...item, quantity: Math.min(item.maxStock || 10, quantity) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId && i.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId || item.id === variantId) {
          return { ...item, quantity: Math.min(item.maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Invalid coupon' };
    } catch {
      return { success: false, message: 'Could not validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        appliedCoupon,
        freeShippingThreshold: shippingSettings.freeShippingThreshold,
        amountNeededForFreeShipping,
        shippingSettings,
        isFreeShippingAlways,
        refreshShippingSettings,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
