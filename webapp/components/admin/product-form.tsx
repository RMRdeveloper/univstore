'use client';

import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Upload, Plus } from 'lucide-react';
import { productsService, categoriesService } from '@/services';
import { apiClient, getImageUrl } from '@/lib';
import { Button, Input, Card, CardContent, CardHeader } from '@/components/ui';
import type { Product, Category } from '@/types';

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    compareAtPrice: initialData?.compareAtPrice || 0,
    stock: initialData?.stock || 0,
    sku: initialData?.sku || '',
    category: initialData?.category.id || '',
    tags: initialData?.tags.join(', ') || '',
    images: initialData?.images || [],
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesService.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { path } = await apiClient.uploadFile('/upload/image', file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, path],
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      // alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (!formData.description || formData.description.length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      return;
    }
    if (!formData.sku) {
      setError('El SKU es requerido');
      return;
    }
    if (!formData.category) {
      setError('Selecciona una categoría');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      compareAtPrice: formData.compareAtPrice || undefined,
      stock: formData.stock,
      sku: formData.sku,
      category: { id: formData.category } as never,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      images: formData.images,
      isActive: true,
    };

    try {
      if (initialData) {
        await productsService.update(initialData.id, payload);
      } else {
        await productsService.create(payload);
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError(`Error al ${initialData ? 'actualizar' : 'crear'} el producto`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <h2 className="text-lg font-semibold">
          {initialData ? 'Editar Producto' : 'Información del Producto'}
        </h2>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
                <Input
                  label="Precio Comparación"
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Tags (separados por coma)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="electronics, featured, new"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes
                </label>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border group">
                      <Image
                        src={getImageUrl(image)}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1 block">Subir Img</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {initialData ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
