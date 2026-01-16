import { apiClient } from '@/lib';
import type { Category } from '@/types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },

  async getRoots(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories/roots');
  },

  async getById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  async getBySlug(slug: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/slug/${slug}`);
  },

  async getChildren(id: string): Promise<Category[]> {
    return apiClient.get<Category[]>(`/categories/${id}/children`);
  },

  async create(data: Partial<Category>): Promise<Category> {
    return apiClient.post<Category>('/categories', data);
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return apiClient.patch<Category>(`/categories/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/categories/${id}`);
  },
};
