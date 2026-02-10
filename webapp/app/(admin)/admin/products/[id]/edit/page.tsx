'use client';

import { use, useEffect, useState } from 'react';
import { productsService } from '@/services';
import { ProductForm } from '@/components/admin';
import type { Product } from '@/types';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const data = await productsService.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div>
      <ProductForm initialData={product} />
    </div>
  );
}
