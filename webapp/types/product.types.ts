import type { Category } from './category.types';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  stock: number;
  sku: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchQueryParams extends ProductQueryParams {
  q?: string;
}
