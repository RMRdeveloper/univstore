'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2 } from 'lucide-react';
import { wishlistService } from '@/services';
import { useAuthStore } from '@/stores';
import { Button, Card } from '@/components/ui';
import { formatPrice, getImageUrl } from '@/lib';
import type { Wishlist } from '@/types';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    async function fetchWishlist() {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const data = await wishlistService.get();
        setWishlist(data);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    try {
      const updated = await wishlistService.removeProduct(productId);
      setWishlist(updated);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu lista está vacía</h1>
        <p className="text-gray-600 mb-8">Guarda tus productos favoritos aquí</p>
        <Link href="/products">
          <Button>Ver Productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Favoritos ({wishlist.products.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">No disponible</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleRemove(product.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
