'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { categoriesService } from '@/services';
import { Button, Input, Card, CardContent, CardHeader } from '@/components/ui';
import type { Category } from '@/types';

interface CategoryFormProps {
  initialData?: Category;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    parent: initialData?.parent?.id || '',
    order: initialData?.order || 0,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesService.getRoots();
        // Exclude current category from parent options if editing (simple loop prevention)
        const availableParents = initialData
          ? data.filter(c => c.id !== initialData.id)
          : data;
        setCategories(availableParents);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      parent: formData.parent ? { id: formData.parent } as never : undefined,
      order: formData.order,
      isActive: true, // Default active for now
    };

    try {
      if (initialData) {
        await categoriesService.update(initialData.id, payload);
      } else {
        await categoriesService.create(payload);
      }
      router.push('/admin/categories');
      router.refresh();
    } catch {
      setError(`Error al ${initialData ? 'actualizar' : 'crear'} la categoría`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <h2 className="text-lg font-semibold">
          {initialData ? 'Editar Categoría' : 'Información de la Categoría'}
        </h2>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría Padre
            </label>
            <select
              value={formData.parent}
              onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Ninguna (raíz)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Orden"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isSubmitting}>
              {initialData ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
