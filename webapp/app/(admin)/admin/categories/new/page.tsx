'use client';

import { CategoryForm } from '@/components/admin';

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Categoría</h1>
      <CategoryForm />
    </div>
  );
}
