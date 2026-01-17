'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productsService, searchService } from '@/services';
import { ProductGrid, ProductFilters } from '@/components/products';
import { Button } from '@/components/ui';
import type { Product, PaginatedResult } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get('q');
  const categoryId = searchParams.get('category');
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [data, setData] = useState<PaginatedResult<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        let result;
        const commonParams = {
          page,
          limit: 12,
          category: categoryId || undefined,
          minPrice,
          maxPrice,
          inStock: true // Default to showing in-stock items? Or typically a filter. Leaving explicit.
        };

        if (q) {
          result = await searchService.search({
            ...commonParams,
            q
          });
        } else {
          result = await productsService.getAll(commonParams);
        }
        setData(result);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [page, q, categoryId, minPrice, maxPrice]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Productos</h1>
        <p className="text-muted-foreground mt-2">
          Explora nuestra selección de productos
        </p>
      </div>

      <ProductFilters />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {data?.items.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-lg">No se encontraron productos con estos filtros.</p>
              <Button
                variant="ghost"
                onClick={() => router.push('/products')}
                className="mt-2 text-indigo-600 hover:bg-indigo-50"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <ProductGrid products={data?.items || []} />
          )}

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Página {page} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.min(data.totalPages, page + 1))}
                disabled={page === data.totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
