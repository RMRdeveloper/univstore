'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { categoriesService } from '@/services';
import type { Category } from '@/types';
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const debouncedSearch = useDebounceValue(search, 500);
  const debouncedMinPrice = useDebounceValue(minPrice, 500);
  const debouncedMaxPrice = useDebounceValue(maxPrice, 500);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await categoriesService.getRoots();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  const updateUrl = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    newSearchParams.set('page', '1');

    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };


  useEffect(() => {
    if (debouncedSearch !== (searchParams.get('q') || '')) {
      updateUrl({ q: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleCategoryChange = (val: string) => {
    setCategoryId(val);
    updateUrl({ category: val });
  };

  useEffect(() => {
    if (debouncedMinPrice !== (searchParams.get('minPrice') || '')) {
      updateUrl({ minPrice: debouncedMinPrice });
    }
  }, [debouncedMinPrice]);

  useEffect(() => {
    if (debouncedMaxPrice !== (searchParams.get('maxPrice') || '')) {
      updateUrl({ maxPrice: debouncedMaxPrice });
    }
  }, [debouncedMaxPrice]);

  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  };

  const hasActiveFilters = search || categoryId || minPrice || maxPrice;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar productos..."
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">

          <div className="relative w-full sm:w-1/3 group">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
              className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${categoryId ? 'text-slate-900 font-medium' : 'text-slate-500'}`}
            >
              <span className="truncate">
                {categoryId
                  ? categories.find(c => c.id === categoryId)?.name || 'Categoría seleccionada'
                  : 'Todas las categorías'}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-md py-1">
                <div
                  className={`cursor-pointer w-full px-3 py-2 text-sm text-left hover:bg-slate-100 ${!categoryId ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-700'}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCategoryChange('');
                    setIsCategoryOpen(false);
                  }}
                >
                  Todas las categorías
                </div>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`cursor-pointer w-full px-3 py-2 text-sm text-left hover:bg-slate-100 ${categoryId === cat.id ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-700'}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCategoryChange(cat.id);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-1/3 items-center">
            <Input
              type="number"
              placeholder="Min $"
              className="bg-slate-50 border-slate-200"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-slate-400">-</span>
            <Input
              type="number"
              placeholder="Max $"
              className="bg-slate-50 border-slate-200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full sm:w-auto text-slate-500 hover:text-rose-500 hover:bg-rose-50"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
