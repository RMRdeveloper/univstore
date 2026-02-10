'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, User, Search, Menu, Store, LogOut, UserCircle, Package } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore, useIsAdmin } from '@/stores';
import { Button } from '@/components/ui';
import { CategoryDropdown } from './category-dropdown';

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = useIsAdmin();
  const { itemCount } = useCartStore();
  const { toggleSidebar, toggleSearch } = useUIStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Menú"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              UnivStore
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              Productos
            </Link>
            <CategoryDropdown />
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleSearch}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            {isAuthenticated ? (
              <>
                <Link href="/wishlist" className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link href="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-indigo-600 rounded-full ring-2 ring-white shadow-sm">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <Store className="h-4 w-4" />
                            Vender
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <UserCircle className="h-4 w-4" />
                          Mi Perfil
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          Mis Órdenes
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

