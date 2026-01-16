'use client';

import { useEffect, useState } from 'react';
import { Package, FolderTree, Users, ShoppingCart } from 'lucide-react';
import { productsService, categoriesService } from '@/services';
import { Card, CardContent } from '@/components/ui';

interface Stats {
  products: number;
  categories: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsService.getAll({ limit: 1 }),
          categoriesService.getAll(),
        ]);
        setStats({
          products: productsData.total,
          categories: categoriesData.length,
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
    { label: 'Usuarios', value: '-', icon: Users, color: 'bg-purple-500' },
    { label: 'Pedidos', value: '-', icon: ShoppingCart, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bienvenido al Panel de Administración</h2>
            <p className="text-gray-600">
              Desde aquí puedes gestionar productos, categorías y usuarios de la tienda.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
