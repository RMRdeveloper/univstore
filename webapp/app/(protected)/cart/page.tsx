"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore, useAuthStore } from "@/stores";
import { Button, Card } from "@/components/ui";
import { formatPrice, getImageUrl } from "@/lib";

export default function CartPage() {
  const {
    cart,
    isLoading,
    itemCount,
    total,
    fetchCart,
    updateItem,
    removeItem,
    clearCart,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (isLoading && !cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-600 mb-8">Agrega productos para comenzar</p>
        <Link href="/products">
          <Button>Ver Productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Carrito ({itemCount})
        </h1>
        <Button variant="ghost" onClick={() => clearCart()}>
          Vaciar Carrito
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.product.id} className="p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={getImageUrl(item.product.images[0])}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                      <button
                        onClick={() =>
                          updateItem(
                            item.product.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="p-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-l-md disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 text-sm text-gray-900 dark:text-white min-w-[1.5rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateItem(
                            item.product.id,
                            Math.min(item.product.stock, item.quantity + 1),
                          )
                        }
                        className="p-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-r-md disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-4">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Envío</span>
                <span className="font-medium text-green-600 dark:text-green-400">Gratis</span>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-600 pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-4">Proceder al Pago</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
