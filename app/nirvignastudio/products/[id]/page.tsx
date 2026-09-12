'use client';

import React, { useEffect, useState } from 'react';
import { ProductForm } from '@/components/admin/product-form';
import { Product } from '@/lib/types';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error('Failed to load product for edit', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-24 text-center font-serif text-zinc-500 text-base">
        Retrieving garment specifications from archive...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center text-zinc-600">
        <h2 className="font-serif text-2xl text-zinc-900">Garment Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1">The requested style could not be located in D1.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
          Archive Revision
        </span>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
          Edit &ldquo;{product.title}&rdquo;
        </h1>
      </div>

      <ProductForm initialProduct={product} isEdit={true} />
    </div>
  );
}
