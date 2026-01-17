interface CategorySeed {
  name: string;
  slug: string;
  description?: string;
  order: number;
  children?: CategorySeed[];
}

export const categoriesSeed: CategorySeed[] = [
  {
    name: 'Electrónica',
    slug: 'electronica',
    description: 'Dispositivos electrónicos y tecnología',
    order: 1,
    children: [
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Teléfonos inteligentes y accesorios',
        order: 1,
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Computadoras portátiles',
        order: 2,
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tabletas y accesorios',
        order: 3,
      },
      {
        name: 'Accesorios',
        slug: 'accesorios-electronica',
        description: 'Accesorios para dispositivos electrónicos',
        order: 4,
      },
    ],
  },
  {
    name: 'Ropa',
    slug: 'ropa',
    description: 'Moda y vestimenta',
    order: 2,
    children: [
      {
        name: 'Hombre',
        slug: 'ropa-hombre',
        description: 'Ropa para hombre',
        order: 1,
      },
      {
        name: 'Mujer',
        slug: 'ropa-mujer',
        description: 'Ropa para mujer',
        order: 2,
      },
      {
        name: 'Niños',
        slug: 'ropa-ninos',
        description: 'Ropa para niños',
        order: 3,
      },
    ],
  },
  {
    name: 'Hogar',
    slug: 'hogar',
    description: 'Artículos para el hogar',
    order: 3,
    children: [
      {
        name: 'Muebles',
        slug: 'muebles',
        description: 'Muebles para el hogar',
        order: 1,
      },
      {
        name: 'Decoración',
        slug: 'decoracion',
        description: 'Artículos decorativos',
        order: 2,
      },
      {
        name: 'Cocina',
        slug: 'cocina',
        description: 'Utensilios y electrodomésticos de cocina',
        order: 3,
      },
    ],
  },
  {
    name: 'Deportes',
    slug: 'deportes',
    description: 'Artículos deportivos y fitness',
    order: 4,
    children: [
      {
        name: 'Fitness',
        slug: 'fitness',
        description: 'Equipos de ejercicio y accesorios',
        order: 1,
      },
      {
        name: 'Outdoor',
        slug: 'outdoor',
        description: 'Equipos para actividades al aire libre',
        order: 2,
      },
    ],
  },
  {
    name: 'Libros',
    slug: 'libros',
    description: 'Libros y publicaciones',
    order: 5,
  },
  {
    name: 'Juguetes',
    slug: 'juguetes',
    description: 'Juguetes y juegos para todas las edades',
    order: 6,
  },
];
