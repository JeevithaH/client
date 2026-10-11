'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { PolicyNav } from '@/components/layout/policy-nav';
import { useToast } from '@/context/toast-context';

export default function ContactPage() {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitted(true);
    success('Message Received', 'Our atelier customer concierge team will respond within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-800">
      {/* Hero Header */}
      <div className="bg-black text-white py-14 sm:py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] uppercase tracking-widest font-mono">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Customer Care &amp; Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Contact Atelier
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Have questions about garment sizing, order tracking, bulk custom orders, or returns? Our dedicated concierge is here to assist.
          </p>
        </div>
      </div>

      <PolicyNav />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: WhatsApp */}
          <div className="p-6 bg-white border border-zinc-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-black">WhatsApp Concierge</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Instant responses for sizing advice, exchange requests, and live tracking assistance.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/916395463874?text=Hello%20STiTCH%20Concierge%2C%20I%20need%20assistance%20with%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="p-6 bg-white border border-zinc-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-black">Email Support</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              For formal inquiries, invoice requests, returns, and media/press kit requests.
            </p>
            <div className="pt-2">
              <a
                href="mailto:the.stitchclothes@gmail.com"
                className="text-xs font-bold font-mono text-black underline hover:text-zinc-600 break-all"
              >
                the.stitchclothes@gmail.com
              </a>
            </div>
          </div>

          {/* Card 3: Hotline & Hours */}
          <div className="p-6 bg-white border border-zinc-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-black">Direct Hotline</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Mon – Sat: 10:00 AM – 7:00 PM IST.<br />
              Sunday: Limited Emergency Support.
            </p>
            <div className="pt-2">
              <a
                href="tel:+916395463874"
                className="text-xs font-bold font-mono text-black underline hover:text-zinc-600"
              >
                +91 6395463874
              </a>
            </div>
          </div>
        </div>

        {/* Form and FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-zinc-200 shadow-2xs space-y-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-black">
                Send Us a Message
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Fill in the details below and our customer support team will reply within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-zinc-50 border border-zinc-300 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-black">Inquiry Submitted</h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. Your message has been routed to our team. We will get back to you at <strong>{email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aryan@example.com"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                    >
                      <option value="Order Inquiry">Order Status &amp; Tracking</option>
                      <option value="Return / Exchange">Return or Size Exchange</option>
                      <option value="Product Sizing">Garment Sizing &amp; Fabric Fit</option>
                      <option value="Custom Bespoke">Bulk &amp; Custom Artwork Order</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide your Order ID (if applicable) and questions..."
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white hover:bg-zinc-800 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Send Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Right Quick FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-lg font-bold text-black border-b border-zinc-200 pb-2">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-white border border-zinc-200 space-y-1">
                <span className="font-bold text-black block">How soon will my order be dispatched?</span>
                <p className="text-zinc-600 leading-relaxed">
                  Orders are typically packed and dispatched within 24 to 48 hours. Express transit takes 2-4 business days for metro cities.
                </p>
              </div>

              <div className="p-4 bg-white border border-zinc-200 space-y-1">
                <span className="font-bold text-black block">How do I exchange for a different size?</span>
                <p className="text-zinc-600 leading-relaxed">
                  We offer a 7-day hassle-free size exchange policy with complimentary doorstep reverse pickup. Simply message our WhatsApp concierge.
                </p>
              </div>

              <div className="p-4 bg-white border border-zinc-200 space-y-1">
                <span className="font-bold text-black block">Is Cash on Delivery available?</span>
                <p className="text-zinc-600 leading-relaxed">
                  Yes, Cash on Delivery is active across 27,000+ pin codes pan-India with a nominal courier handling fee.
                </p>
              </div>

              <div className="p-4 bg-white border border-zinc-200 space-y-1">
                <span className="font-bold text-black block">Do you take custom or bulk team orders?</span>
                <p className="text-zinc-600 leading-relaxed">
                  Yes! Visit our <Link href="/custom" className="underline font-semibold text-black">Bespoke Studio</Link> to design custom merchandise with volume discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
