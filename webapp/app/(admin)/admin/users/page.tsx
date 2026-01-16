'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Card } from '@/components/ui';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const [users] = useState<AdminUser[]>([]);
  const [isLoading] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Usuarios</h1>

      <Card>
        <div className="p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            La gestión de usuarios está disponible a través del API.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Endpoint: GET /api/users (requiere rol admin)
          </p>
        </div>
      </Card>
    </div>
  );
}
