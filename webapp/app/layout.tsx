import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tienda en línea',
  description: 'Tu tienda de confianza',
};

import { Toaster } from '@/components/ui';
import { AuthSync } from '@/components/layout';

/**
 * Layout raíz de la aplicación. Configura fuentes, metadata y
 * envuelve el contenido con AuthSync y Toaster.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthSync />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
