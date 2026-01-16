'use client';

import { ProductForm } from '@/components/admin';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Producto</h1>
      <ProductForm />
    </div>
  );
}
