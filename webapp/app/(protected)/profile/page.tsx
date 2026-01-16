'use client';

import { useRouter } from 'next/navigation';
import { User, Mail, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Button, Card, CardContent, CardHeader } from '@/components/ui';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Información Personal</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Acciones</h2>
        </CardHeader>
        <CardContent>
          <Button variant="danger" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
