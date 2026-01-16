import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tu tienda universitaria de confianza
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Encuentra todo lo que necesitas para tu vida universitaria.
              Libros, materiales, tecnología y mucho más.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Ver Productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explorar Categorías
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Amplio Catálogo</h3>
                <p className="text-sm text-gray-600">
                  Miles de productos disponibles para ti
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Entrega Rápida</h3>
                <p className="text-sm text-gray-600">
                  Recibe tus pedidos en el campus
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Compra Segura</h3>
                <p className="text-sm text-gray-600">
                  Protegemos tu información siempre
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Categorías Populares</h2>
            <Link href="/categories" className="text-blue-600 hover:text-blue-700 font-medium">
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Libros', 'Tecnología', 'Materiales', 'Accesorios'].map((category) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase()}`}
                className="group relative aspect-square rounded-xl bg-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
