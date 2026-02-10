'use client';

import { use, useEffect, useState } from 'react';
import { categoriesService } from '@/services';
import { CategoryForm } from '@/components/admin';
import type { Category } from '@/types';

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      if (!id) return;
      try {
        const data = await categoriesService.getById(id);
        setCategory(data);
      } catch (err) {
        console.error('Error fetching category:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

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
