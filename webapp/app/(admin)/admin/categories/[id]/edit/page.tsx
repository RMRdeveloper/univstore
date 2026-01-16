'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { categoriesService } from '@/services';
import { CategoryForm } from '@/components/admin';
import type { Category } from '@/types';

export default function EditCategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      if (!params.id) return;
      try {
        const data = await categoriesService.getById(params.id as string);
        setCategory(data);
      } catch (err) {
        console.error('Error fetching category:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategory();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!category) {
    return <div>Categoría no encontrada</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Categoría</h1>
      <CategoryForm initialData={category} />
    </div>
  );
}
