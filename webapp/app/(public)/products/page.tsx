'use client';

import { Suspense, use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsService, searchService } from '@/services';
import { ProductGrid, ProductFilters } from '@/components/products';
import { Button } from '@/components/ui';
import type { Product, PaginatedResult } from '@/types';

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParamsRecord, key: string): string | null {
  const v = searchParams[key];
  if (v == null) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

function searchParamsToQueryString(searchParams: SearchParamsRecord): string {
  const p = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v === undefined) return;
    (Array.isArray(v) ? v : [v]).forEach((vv) => p.append(k, vv));
  });
  return p.toString();
}

function ProductsContent({ searchParams }: { searchParams: SearchParamsRecord }) {
  const router = useRouter();

  const q = getParam(searchParams, 'q');
  const categoryId = getParam(searchParams, 'category');
  const minPriceRaw = getParam(searchParams, 'minPrice');
  const maxPriceRaw = getParam(searchParams, 'maxPrice');
  const pageRaw = getParam(searchParams, 'page');
  const minPrice = minPriceRaw ? Number(minPriceRaw) : undefined;
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;
  const page = pageRaw ? Number(pageRaw) : 1;

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
          inStock: true
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
    const next = { ...searchParams, page: String(newPage) };
    router.push(`?${searchParamsToQueryString(next)}`);
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

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const resolved = use(searchParams);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <ProductsContent searchParams={resolved} />
    </Suspense>
  );
}
