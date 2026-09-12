/**
 * ==============================================================================
 * CLOUDFLARE R2 OBJECT STORAGE SERVICE (S3-COMPATIBLE)
 * ==============================================================================
 * 
 * Purpose:
 *   Handles garment photography uploads, colorway imagery, and promotional banners.
 * 
 * Storage Modes Supported:
 *   1. Cloudflare R2 Cloud Mode (Production):
 *      - Streams images to your Cloudflare R2 bucket via AWS S3 SDK v3.
 *      - Zero egress fees; global sub-50ms image distribution.
 *      - Automatically activates when CLOUDFLARE_R2_* environment variables are set.
 * 
 *   2. Local Disk Fallback (Development & Free Mode):
 *      - Saves files to `/public/uploads/` on the local server disk.
 *      - Ensures the app runs reliably without internet or cloud credentials.
 * ==============================================================================
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

export interface R2UploadResult {
  url: string;
  key: string;
  size: number;
}

let cachedS3Client: S3Client | null = null;

/**
 * Creates or returns a cached singleton instance of the S3Client configured for Cloudflare R2.
 * 
 * @returns {S3Client | null} Authenticated S3Client instance, or null if credentials are not configured.
 */
export function getR2Client(): S3Client | null {
  if (cachedS3Client) return cachedS3Client;

  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  cachedS3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return cachedS3Client;
}

/**
 * Resolves the full, public-facing URL for an object stored in R2 or local uploads.
 * 
 * @param {string} key - The storage key or relative path of the image.
 * @returns {string} Fully qualified CDN URL or relative web path.
 * 
 * @example
 * getR2PublicUrl('products/supima-navy.jpg');
 * // Returns: 'https://pub-shipfold.r2.dev/products/supima-navy.jpg'
 */
export function getR2PublicUrl(key: string): string {
  // If the key is already an absolute HTTP(S) URL or root-relative path, return untouched
  if (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('/')) {
    return key;
  }

  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
  if (publicBase) {
    return `${publicBase.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
  }

  return `/${key.replace(/^\//, '')}`;
}

/**
 * Uploads an image buffer to Cloudflare R2 object storage.
 * Automatically falls back to `/public/uploads/` if R2 credentials are unavailable.
 * 
 * @param {Buffer} fileBuffer - The binary image buffer to upload.
 * @param {string} fileName - Original file name of the image.
 * @param {string} [contentType='image/jpeg'] - MIME type of the upload.
 * @returns {Promise<R2UploadResult>} Object containing public URL, object key, and file byte size.
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<R2UploadResult> {
  const client = getR2Client();
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'shipfold-apparel';

  // 1. Production Mode: Upload directly to Cloudflare R2 bucket via S3 API
  if (client) {
    const key = `products/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
        })
      );
      console.log(`[R2 Storage] Successfully uploaded ${key} to Cloudflare R2 bucket: ${bucket}`);
      return {
        url: getR2PublicUrl(key),
        key,
        size: fileBuffer.length,
      };
    } catch (err) {
      console.error('[R2 Storage Notice] Failed to stream to Cloudflare R2; activating local fallback:', err);
    }
  }

  // 2. Local Fallback: Save to `/public/uploads/` on server disk
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, fileBuffer);

    console.log(`[Local Disk Storage] Saved image locally: ${filePath}`);
    return {
      url: `/uploads/${safeName}`,
      key: `uploads/${safeName}`,
      size: fileBuffer.length,
    };
  } catch (err) {
    console.warn('[Upload Warning] Could not persist to disk; returning key URL:', err);
    const key = `products/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    return {
      url: getR2PublicUrl(key),
      key,
      size: fileBuffer.length,
    };
  }
}

/**
 * Deletes an object from Cloudflare R2 or local disk storage.
 * 
 * @param {string} key - The storage key or filename to delete.
 * @returns {Promise<boolean>} True if deletion succeeded or was safely handled.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  const client = getR2Client();
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'shipfold-apparel';

  if (client && !key.startsWith('/uploads/')) {
    try {
      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      return true;
    } catch (err) {
      console.warn('[R2 Delete Warning] Failed to delete object from R2:', err);
      return false;
    }
  }

  // If local file, attempt unlinking
  if (key.startsWith('/uploads/') || key.startsWith('uploads/')) {
    try {
      const cleanPath = key.replace(/^\/?uploads\//, '');
      const localFile = path.join(process.cwd(), 'public', 'uploads', cleanPath);
      if (fs.existsSync(localFile)) {
        fs.unlinkSync(localFile);
      }
      return true;
    } catch {
      return false;
    }
  }

  return true;
}
