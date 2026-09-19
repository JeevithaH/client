'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, RefreshCw, CheckCircle2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/context/toast-context';

interface R2ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedRatio?: string;
  placeholder?: string;
}

export function R2ImageUploader({
  value,
  onChange,
  label = 'Image',
  recommendedRatio = '16:9 or 1:1',
  placeholder = 'https://... or upload from your device to Cloudflare R2',
}: R2ImageUploaderProps) {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error('File Too Large', 'Maximum image size is 5MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
        success('Uploaded to R2', 'Image uploaded to Cloudflare R2 storage bucket.');
      } else {
        error('Upload Failed', data.message || 'Failed to upload to R2');
      }
    } catch {
      error('Upload Error', 'Could not transmit image to Cloudflare R2');
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase font-bold tracking-wider text-zinc-700">
          {label}
        </label>
        <span className="text-[10px] text-zinc-400 font-mono">
          R2 Storage ({recommendedRatio})
        </span>
      </div>

      {/* URL Input Bar with Upload Button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border border-zinc-300 px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-mono"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={onFileInputChange}
          className="hidden"
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 bg-[#0E0E0E] text-white hover:bg-zinc-800 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          {uploading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading to R2...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload to R2</span>
            </>
          )}
        </button>
      </div>

      {/* Drag & Drop Area / Live Preview */}
      {value ? (
        <div className="relative border border-zinc-200 bg-zinc-50 p-2 rounded-xs flex items-center gap-3">
          <div className="relative w-16 h-16 bg-white border border-zinc-200 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {value.includes('r2.dev') || value.includes('r2.cloudflarestorage')
                  ? 'Cloudflare R2 Object Storage Active'
                  : 'Image Configured'}
              </span>
            </div>
            <p className="font-mono text-[10px] text-zinc-500 truncate mt-0.5">{value}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 rounded-xs transition-colors"
              title="Open full size"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xs transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-black bg-zinc-100'
              : 'border-zinc-300 hover:border-zinc-500 bg-zinc-50/50'
          }`}
        >
          <ImageIcon className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
          <p className="text-xs font-semibold text-zinc-700">
            Drag &amp; drop an image here, or{' '}
            <span className="text-black underline underline-offset-2">browse files</span>
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            JPG, PNG, WEBP, or AVIF up to 5MB (stored permanently on Cloudflare R2)
          </p>
        </div>
      )}
    </div>
  );
}
