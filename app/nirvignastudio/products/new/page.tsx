import React from 'react';
import { ProductForm } from '@/components/admin/product-form';

export const metadata = {
  title: 'Catalogue New Garment | Shipfold Director Suite',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
          Product Creation
        </span>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
          Catalogue New T-Shirt Style
        </h1>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
}
