import { apiClient } from '@/lib';
import type { Product, SearchQueryParams, PaginatedResult } from '@/types';

export const searchService = {
  async search(params: SearchQueryParams): Promise<PaginatedResult<Product>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const query = searchParams.toString();
    return apiClient.get<PaginatedResult<Product>>(`/search${query ? `?${query}` : ''}`);
  },
};
