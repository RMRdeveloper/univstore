'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/stores/wishlist.store';
import { ProductCard } from '@/components/products/product-card';
import { Loader2 } from 'lucide-react';

export default function WishlistPage() {
  const { items, isLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi lista de deseos</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">Tu lista de deseos está vacía</p>
          <a
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Seguir comprando
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.filter(item => item && item.id).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
