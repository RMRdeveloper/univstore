import { apiClient } from '@/lib';
import type { Cart } from '@/types';

export const cartService = {
  async get(): Promise<Cart | null> {
    return apiClient.get<Cart | null>('/cart');
  },

  async addItem(productId: string, quantity: number): Promise<Cart> {
    return apiClient.post<Cart>('/cart/items', { productId, quantity });
  },

  async updateItem(productId: string, quantity: number): Promise<Cart> {
    return apiClient.patch<Cart>(`/cart/items/${productId}`, { quantity });
  },

  async removeItem(productId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/items/${productId}`);
  },

  async clear(): Promise<Cart> {
    return apiClient.delete<Cart>('/cart');
  },
};
