import { apiClient } from '@/lib';
import type { Product, ProductQueryParams, PaginatedResult, CreateProductDTO, UpdateProductDTO } from '@/types';

export const productsService = {
  async getAll(params?: ProductQueryParams): Promise<PaginatedResult<Product>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiClient.get<PaginatedResult<Product>>(`/products${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async create(data: CreateProductDTO): Promise<Product> {
    return apiClient.post<Product>('/products', data);
  },

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    return apiClient.patch<Product>(`/products/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/products/${id}`);
  },
};
