'use client';

import { useEffect, useState } from 'react';
import { Package, FolderTree, ShoppingCart } from 'lucide-react';
import { productsService, categoriesService, ordersService } from '@/services';
import { Card, CardContent } from '@/components/ui';

interface Stats {
  products: number;
  categories: number;
  orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, orders: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsResult, categoriesResult, ordersResult] = await Promise.allSettled([
          productsService.getAll({ limit: 1 }),
          categoriesService.getAll(),
          ordersService.getOrdersCount(),
        ]);
        const productsData = productsResult.status === 'fulfilled' ? productsResult.value : { total: 0 };
        const categoriesData = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
        let ordersCount = 0;
        if (ordersResult.status === 'fulfilled') {
          ordersCount = ordersResult.value;
        } else if (ordersResult.reason?.response?.status !== 403) {
          console.error('Error fetching orders count:', ordersResult.reason);
        }
        setStats({
          products: productsData.total,
          categories: Array.isArray(categoriesData) ? categoriesData.length : 0,
          orders: ordersCount,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Productos', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Categorías', value: stats.categories, icon: FolderTree, color: 'bg-green-500' },
    { label: 'Pedidos', value: stats.orders, icon: ShoppingCart, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {isLoading ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">Bienvenido al Panel de Administración</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Desde aquí puedes gestionar productos, categorías y usuarios de la tienda.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
