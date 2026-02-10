import { apiClient } from '@/lib';
import type { Order } from '@/types';

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders');
  },

  async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  async getOrdersCount(): Promise<number> {
    const res = await apiClient.get<{ count: number }>('/orders/stats/count');
    return res.count;
  },
};
