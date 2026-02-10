export interface OrderItemProduct {
  id: string;
  name?: string;
  slug?: string;
  price?: number;
  images?: string[];
}

export interface OrderItem {
  product: OrderItemProduct | string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
