import type { Product } from './product.types';

export interface CartItem {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images' | 'stock'>;
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  products: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images' | 'stock' | 'isActive'>[];
  createdAt: string;
  updatedAt: string;
}
