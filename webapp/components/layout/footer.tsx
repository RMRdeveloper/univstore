import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Tienda</h3>
            <p className="text-sm">
              Tu tienda universitaria de confianza para encontrar todo lo que necesitas.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm hover:text-white">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm hover:text-white">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Cuenta</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm hover:text-white">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm hover:text-white">
                  Carrito
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm hover:text-white">
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>contacto@tienda.edu</li>
              <li>+1 (809) 000-0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Tienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
