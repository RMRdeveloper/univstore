import { create } from 'zustand';
import { wishlistService } from '@/services/wishlist.service';
import type { Wishlist } from '@/types';
import type { Product } from '@/types';

interface WishlistState {
  wishlist: Wishlist | null;
  items: Product[];
  isLoading: boolean;

  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const wishlist = await wishlistService.get();
      set({
        wishlist,
        items: wishlist?.products || []
      });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (productId: string) => {
    // Optimistic update could go here, but for now we wait for server
    try {
      const wishlist = await wishlistService.addProduct(productId);
      set({
        wishlist,
        items: wishlist?.products || []
      });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      const wishlist = await wishlistService.removeProduct(productId);
      set({
        wishlist,
        items: wishlist?.products || []
      });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  },

  isInWishlist: (productId: string) => {
    const { items } = get();
    return items.some((item) => item.id === productId); // Assuming Product has 'id'
  },
}));
