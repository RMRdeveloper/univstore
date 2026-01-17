import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, Shield, Search } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Nueva colección disponible
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              Tu tienda universitaria <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                de confianza
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
              Equípate con lo mejor para tu vida académica. Desde libros y tecnología hasta los accesorios que definen tu estilo en el campus.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 border-hidden">
                  Ver Productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  Explorar Categorías
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Amplio Catálogo</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Accede a miles de productos seleccionados específicamente para estudiantes universitarios.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="bg-violet-50 dark:bg-violet-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-violet-600 dark:text-violet-400">
                  <Truck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Entrega Rápida</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Recibe tus pedidos directamente en el campus o en tu residencia en tiempo récord.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="bg-teal-50 dark:bg-teal-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Compra Segura</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tu seguridad es nuestra prioridad. Pagos encriptados y protección de datos garantizada.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Categorías Populares</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                Explora nuestras categorías más visitadas y encuentra lo que buscas rápidamente.
              </p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" className="hidden sm:flex group">
                Ver todas las categorías
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {['Libros', 'Tecnología', 'Materiales', 'Accesorios'].map((category, index) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase()}`}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Background placeholders using semantic colors for demo since we don't have images yet */}
                <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 ${[
                    'bg-amber-100 dark:bg-amber-900/30',
                    'bg-blue-100 dark:bg-blue-900/30',
                    'bg-emerald-100 dark:bg-emerald-900/30',
                    'bg-rose-100 dark:bg-rose-900/30'
                  ][index]
                  }`} />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-bold text-white mb-2">{category}</h3>
                    <div className="flex items-center text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explorar colección
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/categories" className="block">
              <Button variant="outline" className="w-full">
                Ver todas las categorías
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
