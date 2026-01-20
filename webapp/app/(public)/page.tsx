import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, Shield, Search } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { CategoriesGrid } from '@/components/home';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 ml-[-20%] right-auto w-[40rem] h-[40rem] bg-indigo-100/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob" />
          <div className="absolute top-0 right-0 mr-[-20%] w-[40rem] h-[40rem] bg-violet-100/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-semibold shadow-sm mb-8 transition-transform hover:scale-105 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Nueva colección 2026 disponible
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight text-slate-900">
            Tu tienda universitaria <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              de confianza
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Equípate con lo mejor para tu vida académica. Desde la tecnología más puntera hasta los accesorios que definen tu estilo en el campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="h-14 px-8 text-base bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all duration-300 w-full sm:w-auto">
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Catálogo Curado</h3>
                <p className="text-slate-600 leading-relaxed">
                  Miles de productos seleccionados específicamente para satisfacer las necesidades de estudiantes universitarios exigentes.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-violet-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-violet-600">
                  <Truck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Envíos Flash</h3>
                <p className="text-slate-600 leading-relaxed">
                  Sistema de logística optimizado para entregas rápidas directamente en el campus o residencia estudiantil.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Garantía Total</h3>
                <p className="text-slate-600 leading-relaxed">
                  Compra con total tranquilidad gracias a nuestra pasarela de pagos encriptada y política de devoluciones flexible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Categorías Tendencia</h2>
              <p className="text-slate-600 text-lg max-w-xl">
                Explora las secciones más visitadas y encuentra rápidamente lo que necesitas para tu día a día.
              </p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" className="hidden sm:flex group text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Ver todas las categorías
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <CategoriesGrid />

          <div className="mt-8 sm:hidden">
            <Link href="/categories" className="block">
              <Button variant="outline" className="w-full border-slate-200">
                Ver todas las categorías
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
