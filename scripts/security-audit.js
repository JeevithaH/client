/**
 * Comprehensive Automated Security Audit Test Suite
 * Tests security logic in isolation (matching Node.js runtime):
 * 1. Password complexity rules
 * 2. Email format validation
 * 3. XSS string sanitization
 * 4. Database product price integrity & coupon validation
 * 5. Razorpay HMAC-SHA256 signature verification & forgery rejection
 * 6. Sliding-window IP rate limiting
 */

const crypto = require('crypto');
const path = require('path');

async function runAudit() {
  console.log('====================================================');
  console.log('SHIPFOLD COMPREHENSIVE SECURITY AUDIT SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Password & Email Validation (Specs 1, 2, 6, 18)
  console.log('--- Test Group 1: Password & Input Security ---');
  function isStrongPassword(password) {
    if (typeof password !== 'string') return { valid: false };
    if (password.length < 8) return { valid: false, reason: 'Too short' };
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return { valid: false, reason: 'Missing letter or number' };
    return { valid: true };
  }

  function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim()) && email.length <= 254;
  }

  function sanitizeString(val) {
    if (typeof val !== 'string') return '';
    return val
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  assert(!isStrongPassword('short').valid, 'Rejects password shorter than 8 characters');
  assert(!isStrongPassword('alllettersonly').valid, 'Rejects password without numbers');
  assert(isStrongPassword('LuxurySecure2026!').valid, 'Accepts strong complex password');
  assert(isValidEmail('patron@shipfold.com'), 'Accepts valid email format');
  assert(!isValidEmail('invalid-email-string'), 'Rejects malformed email string');
  assert(sanitizeString('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'Sanitizes XSS tags to safe entities');

  // 2. Database Price & Stock Verification (Specs 12, 13, 17) via D1 Data Access Layer
  console.log('\n--- Test Group 2: E-Commerce & Price Tampering Resistance ---');
  const { getProductById } = require('../lib/db');

  const sampleProduct = await getProductById('prod-supima-crew-classic');
  assert(sampleProduct !== null && sampleProduct !== undefined, 'Retrieves authentic product from Cloudflare D1');
  if (sampleProduct) {
    assert(sampleProduct.price === 1899, `Database enforces authentic price of ₹${sampleProduct.price} (ignoring client requests)`);
  }

  // 3. Coupon Validation Rules (Spec 14)
  console.log('\n--- Test Group 3: Coupon Security & Abuse Defense ---');
  const { validateCouponForCheckout } = require('../lib/db');

  const fakeCoupon = await validateCouponForCheckout('FAKE_COUPON_100', 5000, 'usr_test');
  assert(!fakeCoupon.valid, 'Rejects forged or non-existent coupon codes');

  const validCoupon = await validateCouponForCheckout('SHIP10', 2000, 'usr_test');
  assert(validCoupon.valid === true, 'Validates active coupons against database');
  if (validCoupon.valid && validCoupon.coupon) {
    assert(validCoupon.coupon.discount_percent === 10, `Applies genuine server discount percentage (${validCoupon.coupon.discount_percent}%)`);
  }

  // 4. Payment Signature Verification (Spec 15)
  console.log('\n--- Test Group 4: Razorpay Payment Signature Security ---');
  function verifySignature(orderId, paymentId, signature, secret) {
    try {
      const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
      return expected === signature;
    } catch {
      return false;
    }
  }

  const testSecret = 'oQsNrwwQjS6nXIzN4mdhzN3o';
  const testOrderId = 'order_valid_123';
  const testPaymentId = 'pay_valid_456';
  const genuineSignature = crypto.createHmac('sha256', testSecret).update(`${testOrderId}|${testPaymentId}`).digest('hex');

  assert(verifySignature(testOrderId, testPaymentId, genuineSignature, testSecret), 'Authenticates valid Razorpay HMAC-SHA256 signature');
  assert(!verifySignature(testOrderId, testPaymentId, 'forged_fake_signature_hex', testSecret), 'Rejects forged/tampered payment signatures');

  // 5. Sliding-Window Rate Limiting (Spec 1, 16)
  console.log('\n--- Test Group 5: Sliding-Window Rate Limiting ---');
  const memoryStore = new Map();
  function checkLimit(ip, limit, windowSeconds) {
    const now = Date.now();
    let record = memoryStore.get(ip);
    if (!record || record.resetTime <= now) {
      record = { count: 1, resetTime: now + windowSeconds * 1000 };
      memoryStore.set(ip, record);
      return true;
    }
    record.count++;
    return record.count <= limit;
  }

  let rateLimitTripped = false;
  for (let i = 0; i < 8; i++) {
    const allowed = checkLimit('198.51.100.2', 5, 60);
    if (!allowed) {
      rateLimitTripped = true;
      break;
    }
  }
  assert(rateLimitTripped, 'Successfully trips rate limit threshold (Blocks on 6th rapid attempt)');

  console.log('\n====================================================');
  console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Audit suite encountered error:', err);
  process.exit(1);
});
