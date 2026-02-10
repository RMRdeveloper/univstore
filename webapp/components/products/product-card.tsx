import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn, formatPrice, getImageUrl } from '@/lib';
import { Card } from '@/components/ui';
import type { Product } from '@/types';
import { useCartStore, useAuthStore, useWishlistStore } from '@/stores';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem, isLoading: isAddingToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Inicia sesión para comprar');
      return;
    }
    if (product.stock === 0) return;
    try {
      await addItem(product.id, 1);
      toast.success('Agregado al carrito');
    } catch (err) {
      console.error(err);
      toast.error('Error al agregar al carrito');
    }
  }, [product.id, product.stock, isAuthenticated, addItem]);

  const toggleWishlist = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        toast.success('Eliminado de la lista de deseos');
      } else {
        await addToWishlist(product.id);
        toast.success('Agregado a la lista de deseos');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al actualizar la lista de deseos');
    } finally {
      setIsLoading(false);
    }
  }, [inWishlist, product.id, addToWishlist, removeFromWishlist]);

  return (
    <div className={cn('group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300', className)}>
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Container with Padding */}
        <div className="relative aspect-[4/5] bg-slate-50/50 p-6 overflow-hidden">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.name}
            fill
            className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {hasDiscount && (
              <span className="px-3 py-1 text-[10px] font-bold text-white tracking-wider uppercase bg-rose-500 rounded-full shadow-sm">
                -{Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-3 py-1 text-[10px] font-bold text-white tracking-wider uppercase bg-slate-900 rounded-full shadow-sm">
                Agotado
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {/* Wishlist Button */}
          <button
            className={cn(
              "absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 transition-all duration-300 z-20",
              inWishlist
                ? "text-rose-500 bg-rose-50 border-rose-100"
                : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
            )}
            onClick={toggleWishlist}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin" />
            ) : (
              <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
            )}
          </button>

          {/* Full Width Button on Hover */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
            <button
              className="w-full py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? 'Agotado' : 'Agregar'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3">
            <span className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded-md">
              {product.category?.name || 'Varios'}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through decoration-slate-300">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
