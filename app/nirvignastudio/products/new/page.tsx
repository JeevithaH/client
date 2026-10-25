import React from 'react';
import { ProductForm } from '@/components/admin/product-form';

export const metadata = {
  title: 'Add New Product | AVIVEKY Studio',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
          Product Catalog
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
          Add New Product
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Fill in essential details, upload photos, and set available sizes to publish instantly.
        </p>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
}
