export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Pick<Category, 'id' | 'name' | 'slug'>;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
