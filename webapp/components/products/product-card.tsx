import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { cn, formatPrice, getImageUrl } from '@/lib';
import { Card } from '@/components/ui';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Card className={cn('group overflow-hidden', className)}>
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
              Oferta
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-white font-medium">Agotado</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Agregar a favoritos"
      >
        <Heart className="h-4 w-4" />
      </button>
    </Card>
  );
}
