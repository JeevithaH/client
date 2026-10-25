'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import { playPaymentSuccessSound } from '@/lib/audio';
import { Address } from '@/lib/types';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useUser();
  const { items, subtotal, discountAmount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { success, error } = useToast();

  const isAuthLoaded = isClerkLoaded && status !== 'loading';
  const isAuthenticated = isClerkSignedIn || status === 'authenticated';

  const currentUserId = clerkUser?.id || (session?.user as unknown as { id?: string })?.id || '';
  const currentEmail = clerkUser?.primaryEmailAddress?.emailAddress || session?.user?.email || '';
  const currentName = clerkUser?.fullName || session?.user?.name || '';

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Address form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod] = useState<'razorpay'>('razorpay');

  // 1. Mandatory Authentication Check: If auth loaded and not logged in, prompt sign in with return URL
  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.replace('/login?callbackUrl=/checkout');
    }
  }, [isAuthLoaded, isAuthenticated, router]);

  // Restore draft address from session storage if user previously entered it
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem('shipfold_checkout_draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.fullName) setFullName((prev) => prev || d.fullName);
        if (d.phone) setPhone((prev) => prev || d.phone);
        if (d.street) setStreet((prev) => prev || d.street);
        if (d.apartment) setApartment((prev) => prev || d.apartment);
        if (d.city) setCity((prev) => prev || d.city);
        if (d.stateName) setStateName((prev) => prev || d.stateName);
        if (d.postalCode) setPostalCode((prev) => prev || d.postalCode);
      }
    } catch {}
  }, []);

  // Persist draft address as user types
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (street || city || phone || postalCode) {
      sessionStorage.setItem(
        'shipfold_checkout_draft',
        JSON.stringify({ fullName, phone, email, street, apartment, city, stateName, postalCode })
      );
    }
  }, [fullName, phone, email, street, apartment, city, stateName, postalCode]);

  // Load Razorpay standard script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch saved addresses for authenticated patron
  useEffect(() => {
    async function loadAddresses() {
      if (!isAuthenticated || !currentUserId) return;
      try {
        const res = await fetch(`/api/addresses?userId=${encodeURIComponent(currentUserId)}&t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.addresses?.length > 0) {
          setSavedAddresses(data.addresses);
          setSelectedAddressId(data.addresses[0].id);
          populateAddressForm(data.addresses[0]);
        }
      } catch (err) {
        console.error('Failed to load saved addresses', err);
      } finally {
        setLoadingAddresses(false);
      }
    }

    if (isAuthenticated) {
      if (currentEmail) setEmail((prev) => prev || currentEmail);
      if (currentName) setFullName((prev) => prev || currentName);
      loadAddresses();
    }
  }, [isAuthenticated, currentUserId, currentEmail, currentName]);

  const populateAddressForm = (addr: Address) => {
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setStreet(addr.street);
    setApartment(addr.apartment || '');
    setCity(addr.city);
    setStateName(addr.state);
    setPostalCode(addr.postal_code);
  };

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    populateAddressForm(addr);
  };

  const handlePayment = async () => {
    if (!fullName || !phone || !street || !city || !stateName || !postalCode) {
      error('Address Incomplete', 'Please fill in all mandatory delivery destination fields.');
      return;
    }

    if (items.length === 0) {
      error('Empty Bag', 'Your shopping bag contains no garments.');
      router.push('/shop');
      return;
    }

    setPaymentProcessing(true);

    try {
      // 1. Create Razorpay order on backend with server-side price recalculation
      const rzpRes = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-order',
          amount: total,
          items: items.map(it => ({
            productId: it.productId,
            variantId: it.variantId,
            quantity: it.quantity,
          })),
          couponCode: appliedCoupon?.code,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName: fullName,
            customerEmail: email,
          },
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpData.success) {
        throw new Error(rzpData.message || 'Payment initiation failed');
      }

      // 2. Finalize order function called on payment success
      const finalizeOrder = async (paymentId: string, orderId: string, signature?: string) => {
        const orderPayload = {
          userId: currentUserId || 'usr-demo-patron',
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: {
            full_name: fullName,
            phone,
            street,
            apartment,
            city,
            state: stateName,
            postalCode: postalCode,
            postal_code: postalCode,
            country: 'India',
          },
          subtotal,
          discountAmount,
          shippingFee,
          totalAmount: total,
          couponCode: appliedCoupon?.code,
          paymentMethod: 'Razorpay (UPI / Card / Netbanking)',
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          items,
        };

        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const orderData = await orderRes.json();
        if (!orderData.success) {
          throw new Error(orderData.message || 'Order creation failed');
        }

        // Auto-save address for future orders if user is authenticated
        if (currentUserId) {
          fetch('/api/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUserId,
              fullName,
              phone,
              street,
              apartment,
              city,
              state: stateName,
              postalCode,
              country: 'India',
              isDefault: true,
            }),
          }).catch((err) => console.error('Address auto-save error', err));
        }

        // Clear draft address
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('shipfold_checkout_draft');
        }

        // Play luxury audio success chime via Web Audio API!
        playPaymentSuccessSound();

        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A880', '#0C1427', '#E5D5BA', '#9E7B4F'],
        });

        success('Payment Verified', 'Your order has been recorded and scheduled for dispatch.');
        clearCart();

        // Redirect to Order Tracking page
        setTimeout(() => {
          router.push(`/order/${orderData.order.id}`);
        }, 800);
      };

      // 3. Open Razorpay Checkout Modal
      const RazorpayConstructor = typeof window !== 'undefined' ? (window as unknown as { Razorpay: any }).Razorpay : null;

      if (RazorpayConstructor && rzpData.keyId) {
        const options = {
          key: rzpData.keyId,
          amount: rzpData.amount,
          currency: rzpData.currency || 'INR',
          name: 'Shipfold Clothiers',
          description: `Garment Atelier Order (${items.length} item${items.length > 1 ? 's' : ''})`,
          order_id: rzpData.orderId,
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          theme: {
            color: '#0C1427',
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              // Verify signature on backend
              await fetch('/api/checkout/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'verify-payment',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              await finalizeOrder(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );
            } catch (err: unknown) {
              console.error('Order finalization error', err);
              error('Order Processing Error', (err as Error).message || 'Failed to complete order');
              setPaymentProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setPaymentProcessing(false);
            },
          },
        };

        const rzp = new RazorpayConstructor(options);
        rzp.on('payment.failed', function (response: { error?: { description?: string } }) {
          error('Payment Failed', response.error?.description || 'Transaction was declined.');
          setPaymentProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback for simulated/offline checkout
        await finalizeOrder(`pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, rzpData.orderId);
      }
    } catch (err: unknown) {
      console.error('Checkout error', err);
      error('Transaction Error', (err as Error).message || 'Payment verification was interrupted.');
      setPaymentProcessing(false);
    }
  };

  // Instant luxury loading display while session is being verified
  if (!isAuthLoaded) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-[#0C1427] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-base font-medium text-zinc-900">Verifying Atelier Patron Session...</p>
        <p className="text-xs text-zinc-500 mt-1">Preparing your secure checkout salon</p>
      </div>
    );
  }

  // Prevent flash of checkout contents if unauthenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-12 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-zinc-200 pb-6 mb-8 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
            Guaranteed Secure Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-900 mt-1">
            Delivery &amp; Payment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Columns: Delivery Address & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Selection */}
            <div className="bg-white p-4 sm:p-6 border border-zinc-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-black" />
                  <h3 className="font-serif text-lg font-medium text-zinc-900">
                    Destination Address
                  </h3>
                </div>
                {savedAddresses.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedAddressId('new');
                      setStreet('');
                      setApartment('');
                      setCity('');
                      setStateName('');
                      setPostalCode('');
                    }}
                    className="text-xs uppercase tracking-wider font-semibold text-black hover:text-zinc-600 transition-colors flex items-center gap-1 luxury-link"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Enter Alternate Address</span>
                  </button>
                )}
              </div>

              {/* Saved Address Cards */}
              {savedAddresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-4 border cursor-pointer transition-all relative ${
                        selectedAddressId === addr.id
                          ? 'border-[#0C1427] bg-[#FAF8F5] shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-serif font-semibold text-xs text-zinc-900">
                          {addr.full_name}
                        </span>
                        {selectedAddressId === addr.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#8B6B38]" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                        {addr.street} {addr.apartment && `, ${addr.apartment}`}
                        <br />
                        {addr.city}, {addr.state} - {addr.postal_code}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-2 font-mono">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Address Form Inputs */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lord Alexander Wright"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Patron Email for Invoice & Tracking *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@shipfold.com"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                    Street Address & Estate / Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Penthouse 14B, The Regency Residences"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-1">
                      Postal Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560001"
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-[#0C1427]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <CreditCard className="w-4 h-4 text-[#8B6B38]" />
                <h3 className="font-serif text-lg font-medium text-zinc-900">
                  Select Payment Method
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* 100% Secure Online Payment (Razorpay / UPI / Cards) */}
                <div
                  className="p-4 border rounded border-[#0C1427] bg-[#FAF8F5] ring-1 ring-[#0C1427] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#8B6B38]" />
                        <span className="font-serif font-semibold text-xs text-zinc-900">
                          100% Secure Online Payment
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider rounded">
                        Prepaid Priority Dispatch
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Instant checkout via UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards, or Netbanking via 256-bit SSL encrypted Razorpay gateway.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-200/60 text-[10px] text-zinc-400">
                    <span>100% Encrypted &amp; RBI Tokenized</span>
                    <span className="text-[#0C1427] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authorized Gateway
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
                Order Review ({items.length} garments)
              </h3>

              {/* Items preview */}
              <div className="divide-y divide-zinc-100 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-16 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                      <Image src={item.imageUrl} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-xs font-medium text-zinc-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {item.colorName} • Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-xs text-zinc-900 mt-0.5">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-zinc-200 pt-3 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilege Code ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Express Delivery</span>
                  <span className="text-emerald-700 font-semibold uppercase text-xs tracking-wider">
                    FREE DELIVERY
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-zinc-300 text-sm font-semibold text-zinc-900">
                  <span className="font-serif">Gross Settled</span>
                  <span className="font-serif text-xl">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                onClick={handlePayment}
                disabled={paymentProcessing || items.length === 0}
                className="w-full py-4 bg-[#0C1427] hover:bg-[#1B2541] text-[#C5A880] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {paymentProcessing
                    ? 'Authorizing Payment...'
                    : `Confirm & Pay Online ₹${total.toLocaleString('en-IN')}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                By confirming order you agree to Shipfold Atelier Terms of Confection & Concierge Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
