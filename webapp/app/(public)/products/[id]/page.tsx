'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { productsService } from '@/services';
import { useCartStore, useAuthStore, useWishlistStore } from '@/stores';
import { Button } from '@/components/ui';
import { formatPrice, getImageUrl, cn } from '@/lib';
import type { Product } from '@/types';

import { ChevronRight, ShieldCheck, Truck, RotateCcw, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { ImageViewer } from '@/components/ui';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { addItem, isLoading: isAddingToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const inWishlist = product ? isInWishlist(product.id) : false;

  const toggleWishlist = async () => {
    if (!product || !isAuthenticated) return;

    setIsWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await productsService.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !isAuthenticated) return;
    try {
      await addItem(product.id, quantity);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[4/5] bg-slate-100 rounded-3xl animate-pulse" />
          <div className="space-y-6 pt-8">
            <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
            <div className="h-12 bg-slate-100 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-slate-100 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Producto no encontrado</h2>
        <p className="text-slate-500 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
        <Link href="/products">
          <Button>Volver al catálogo</Button>
        </Link>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Inicio</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
          <Link href="/products" className="hover:text-indigo-600 transition-colors">Productos</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
          <span className="text-slate-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-6">
            <div
              className="relative aspect-square sm:aspect-[4/5] rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-sm group cursor-zoom-in"
              onClick={() => setIsViewerOpen(true)}
            >
              <Image
                src={getImageUrl(product.images[selectedImage])}
                alt={product.name}
                fill
                className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                priority
                unoptimized
              />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>

              {hasDiscount && (
                <span className="absolute top-6 left-6 px-4 py-2 text-sm font-bold tracking-wide text-white bg-rose-500 rounded-full shadow-lg shadow-rose-500/30">
                  OFERTA
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300
                      ${selectedImage === index
                        ? 'ring-2 ring-indigo-600 ring-offset-2 opacity-100 scale-105'
                        : 'ring-1 ring-slate-200 opacity-70 hover:opacity-100 hover:scale-105'}`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className="object-contain p-2 bg-white"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 h-fit space-y-8 py-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                  {product.category.name}
                </span>
                {product.stock > 0 ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                    En Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    Agotado
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <div className="flex flex-col">
                    <span className="text-lg text-slate-400 line-through decoration-2">
                      {formatPrice(product.compareAtPrice!)}
                    </span>
                    <span className="text-xs font-bold text-rose-500">
                      Ahorras {formatPrice(product.compareAtPrice! - product.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Cantidad</span>
                <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-14 text-base bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 hover:shadow-none transition-all duration-300 rounded-xl"
                  onClick={handleAddToCart}
                  isLoading={isAddingToCart}
                  disabled={product.stock === 0 || !isAuthenticated}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "h-14 w-14 p-0 rounded-xl border-slate-200 transition-colors",
                    inWishlist && "bg-rose-50 border-rose-100"
                  )}
                  onClick={toggleWishlist}
                  disabled={isWishlistLoading || !isAuthenticated}
                >
                  {isWishlistLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin" />
                  ) : (
                    <Heart className={cn(
                      "h-5 w-5 transition-colors",
                      inWishlist ? "text-rose-500 fill-current" : "text-slate-400 hover:text-rose-500"
                    )} />
                  )}
                </Button>
              </div>

              {!isAuthenticated && (
                <p className="text-sm text-center text-slate-500">
                  <Link href="/auth/login" className="text-indigo-600 font-medium hover:underline">
                    Inicia sesión
                  </Link> para comprar este producto.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Envío Rápido</h4>
                  <p className="text-xs text-slate-500">En campus y ciudad.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Garantía</h4>
                  <p className="text-xs text-slate-500">Calidad asegurada.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={product.images}
        initialIndex={selectedImage}
      />
    </>
  );
}
