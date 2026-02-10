'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { categoriesService } from '@/services';
import type { Category } from '@/types';

/**
 * Grid de las primeras 4 categorías raíz. Carga dinámicamente desde la API
 * y muestra skeleton mientras carga.
 */
export function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesService.getRoots();
        setCategories(data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-slate-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No hay categorías disponibles por el momento.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
        >
          <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 ${[
            'bg-gradient-to-br from-indigo-500 to-blue-600',
            'bg-gradient-to-br from-slate-800 to-black',
            'bg-gradient-to-br from-amber-400 to-orange-500',
            'bg-gradient-to-br from-rose-400 to-pink-600'
          ][index % 4]
            }`}
          />

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
            <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
              Explorar colección
              <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
