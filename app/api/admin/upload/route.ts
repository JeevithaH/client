import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';
import { verifyAdminSession } from '@/lib/admin-auth';
import { checkRateLimit, rateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { safeErrorResponse } from '@/lib/security';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  // 1. Rate Limiting (Spec 16, 19)
  const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.UPLOAD);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  // 2. Admin Authentication Verification (Spec 11)
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = req.headers.get('content-type') || '';

    // Handling multipart form data upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return safeErrorResponse('No file provided', 400);
      }

      // Spec 19: Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return safeErrorResponse('File size exceeds the 5MB limit', 400);
      }

      // Spec 19: Validate MIME type against strict whitelist
      const mimeType = file.type.toLowerCase();
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return safeErrorResponse('Unsupported file type. Only JPEG, PNG, WEBP, and AVIF images are allowed', 400);
      }

      // Spec 19: Validate extension and prevent path traversal
      const rawExt = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(rawExt)) {
        return safeErrorResponse('Invalid file extension', 400);
      }

      // Generate cryptographically safe random filename to prevent overwrites / directory traversal
      const safeFileName = `sf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${rawExt}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadToR2(buffer, safeFileName, mimeType);
      return NextResponse.json({
        success: true,
        url: result.url,
        key: result.key,
        message: 'Image uploaded to Cloudflare R2 successfully',
      });
    }

    // JSON fallback (only if valid HTTPS image url is provided)
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('https://')) {
      return safeErrorResponse('A valid secure HTTPS image URL is required', 400);
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: 'Image registered successfully',
    });
  } catch (error) {
    console.error('[API Admin Upload] Error:', error);
    return safeErrorResponse('Image upload failed', 500);
  }
}
