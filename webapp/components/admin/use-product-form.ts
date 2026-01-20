import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { productsService, categoriesService } from '@/services';
import { apiClient } from '@/lib';
import type { Product, Category, CreateProductDTO } from '@/types';

interface UseProductFormProps {
  initialData?: Product;
}

// Local state interface that handles both files and URL strings for images
interface ProductFormState extends Omit<CreateProductDTO, 'images'> {
  images: (string | File)[];
}

export function useProductForm({ initialData }: UseProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ProductFormState>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    compareAtPrice: initialData?.compareAtPrice || 0,
    stock: initialData?.stock || 0,
    sku: initialData?.sku || '',
    category: initialData?.category.id || '',
    tags: initialData?.tags || [],
    images: initialData?.images || [],
    isActive: initialData?.isActive ?? true,
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

  const updateField = <K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (!formData.description || formData.description.length < 10) return 'La descripción debe tener al menos 10 caracteres';
    if (!formData.sku) return 'El SKU es requerido';
    if (!formData.category) return 'Selecciona una categoría';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload pending images (Files)
      const uploadedImagePaths = await Promise.all(
        formData.images.map(async (img) => {
          if (typeof img === 'string') return img;
          try {
            const { path } = await apiClient.uploadFile('/upload/image', img);
            return path;
          } catch (err) {
            console.error('Error uploading image', err);
            throw new Error(`Error al subir la imagen ${img.name}`);
          }
        })
      );

      // 2. Prepare payload matching CreateProductDTO
      const payload: CreateProductDTO = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice || undefined,
        stock: formData.stock,
        sku: formData.sku,
        category: formData.category, // Now securely typed as string
        tags: formData.tags,
        images: uploadedImagePaths,
        isActive: formData.isActive,
      };

      if (initialData) {
        await productsService.update(initialData.id, payload);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productsService.create(payload);
        toast.success('Producto creado exitosamente');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Error al ${initialData ? 'actualizar' : 'crear'} el producto`);
      toast.error(err.message || `Error al ${initialData ? 'actualizar' : 'crear'} el producto`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    categories,
    isSubmitting,
    error,
    updateField,
    handleSubmit
  };
}
