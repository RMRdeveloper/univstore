'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FolderTree, Users, ArrowLeft } from 'lucide-react';
import { useAuthStore, useIsAdmin } from '@/stores';
import { cn } from '@/lib';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/categories', label: 'Categorías', icon: FolderTree },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isHydrated && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <h1 className="mt-4 text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
