import { create } from 'zustand';
import { cartService } from '@/services';
import type { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  total: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const calculateCartTotals = (items: CartItem[]): { itemCount: number; total: number } => {
  return items.reduce(
    (acc, item) => ({
      itemCount: acc.itemCount + item.quantity,
      total: acc.total + item.product.price * item.quantity,
    }),
    { itemCount: 0, total: 0 },
  );
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  itemCount: 0,
  total: 0,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartService.get();
      const totals = cart ? calculateCartTotals(cart.items) : { itemCount: 0, total: 0 };
      set({ cart, ...totals, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.addItem(productId, quantity);
      const totals = calculateCartTotals(cart.items);
      set({ cart, ...totals, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('Failed to add item to cart');
    }
  },

  updateItem: async (productId, quantity) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.updateItem(productId, quantity);
      const totals = calculateCartTotals(cart.items);
      set({ cart, ...totals, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('Failed to update cart');
    }
  },

  removeItem: async (productId) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.removeItem(productId);
      const totals = calculateCartTotals(cart.items);
      set({ cart, ...totals, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('Failed to remove item');
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartService.clear();
      set({ cart, itemCount: 0, total: 0, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
