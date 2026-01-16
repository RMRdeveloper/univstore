'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores';
import { Button, Input } from '@/components/ui';

const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      await login(data);
      router.push('/');
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Iniciar Sesión
      </h2>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Iniciar Sesión
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
          Regístrate
        </Link>
      </p>
    </>
  );
}
