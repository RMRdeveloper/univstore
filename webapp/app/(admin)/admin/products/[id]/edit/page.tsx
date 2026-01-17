'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productsService } from '@/services';
import { ProductForm } from '@/components/admin';
import type { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;
      try {
        const data = await productsService.getById(params.id as string);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

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
