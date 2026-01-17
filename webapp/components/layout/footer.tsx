import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Tienda</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tu tienda universitaria de confianza para encontrar todo lo que necesitas con la mejor calidad.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm hover:text-white transition-colors">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Cuenta</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm hover:text-white transition-colors">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm hover:text-white transition-colors">
                  Carrito
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm hover:text-white transition-colors">
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span>contacto@tienda.edu</span>
              </li>
              <li>+1 (809) 000-0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Tienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
