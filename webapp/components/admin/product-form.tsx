'use client';

import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { ImageUploader } from './image-uploader';
import { TagsInput } from './tags-input';
import { useProductForm } from './use-product-form';
import type { Product } from '@/types';
import {
  Save,
  X,
  Package,
  ImageIcon,
  DollarSign,
  Layers,
  Tag,
  Archive,
  Info
} from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const {
    formData,
    categories,
    isSubmitting,
    error,
    updateField,
    handleSubmit
  } = useProductForm({ initialData });

  return (
    <form onSubmit={handleSubmit} className="relative space-y-8 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md py-4 -mx-8 px-8 border-b border-slate-200/50">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <p className="text-sm text-slate-500">
            {initialData ? `Editando SKU: ${initialData.sku}` : 'Completa la información para tu catálogo'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="hover:bg-slate-200/50">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="shadow-lg shadow-indigo-500/20">
            <Save className="w-4 h-4 mr-2" />
            {initialData ? 'Guardar Cambios' : 'Publicar Producto'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
          <Info className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50/50">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900">Información General</h3>
            </div>
            <div className="p-6 space-y-6">
              <Input
                label="Nombre del Producto"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ej: Auriculares Sony WH-1000XM5"
                className="font-medium text-lg"
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={6}
                  placeholder="Describe las características principales, especificaciones y beneficios..."
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm transition-all bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-ring/50 resize-y min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50/50">
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900">Galería de Imágenes</h3>
            </div>
            <div className="p-6">
              <ImageUploader
                images={formData.images}
                onImagesChange={(images) => updateField('images', images)}
                maxImages={8}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50/50">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900">Organización</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-input rounded-xl text-sm transition-all bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-ring/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-background text-foreground">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-background text-foreground">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Etiquetas
                </label>
                <TagsInput
                  value={formData.tags as string[]}
                  onChange={(tags) => updateField('tags', tags)}
                  placeholder="Ej: nuevo, oferta, verano"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50/50">
              <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900">Precios</h3>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Precio de Venta"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              <Input
                label="Precio Original (Antes)"
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={(e) => updateField('compareAtPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2 bg-slate-50/50">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Archive className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900">Inventario</h3>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Stock Disponible"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => updateField('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <Input
                label="SKU (Referencia)"
                value={formData.sku}
                onChange={(e) => updateField('sku', e.target.value)}
                placeholder="SKU-..."
              />
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
