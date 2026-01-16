import { apiClient } from '@/lib';
import type { Wishlist } from '@/types';

export const wishlistService = {
  async get(): Promise<Wishlist | null> {
    return apiClient.get<Wishlist | null>('/wishlist');
  },

  async addProduct(productId: string): Promise<Wishlist> {
    return apiClient.post<Wishlist>(`/wishlist/${productId}`);
  },

  async removeProduct(productId: string): Promise<Wishlist> {
    return apiClient.delete<Wishlist>(`/wishlist/${productId}`);
  },
};
