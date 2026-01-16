'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/stores';
import { Button, Card } from '@/components/ui';
import { formatPrice, getImageUrl } from '@/lib';

export default function CartPage() {
  const { cart, isLoading, itemCount, total, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
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
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Carrito ({itemCount})</h1>
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
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.product.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {item.product.name}
                  </Link>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateItem(item.product.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                        className="p-1 hover:bg-gray-100"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg">
              Proceder al Pago
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
