'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui';

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { itemCount } = useCartStore();
  const { toggleSidebar, toggleSearch } = useUIStore();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Menú"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="text-xl font-bold text-gray-900">
              Tienda
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Productos
            </Link>
            <Link href="/categories" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Categorías
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            {isAuthenticated ? (
              <>
                <Link href="/wishlist" className="p-2 text-gray-600 hover:text-gray-900">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium text-white bg-blue-600 rounded-full">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className="p-2 text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
