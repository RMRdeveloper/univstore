import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../../modules/categories/schemas/category.schema.js';
import { categoriesSeed } from './data/categories.seed.js';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) { }

  async seedCategories(): Promise<void> {
    this.logger.log('Starting categories seed...');

    for (const category of categoriesSeed) {
      await this.createCategoryWithChildren(category);
    }

    this.logger.log('Categories seed completed successfully');
  }

  private async createCategoryWithChildren(
    categoryData: {
      name: string;
      slug: string;
      description?: string;
      order: number;
      children?: Array<{
        name: string;
        slug: string;
        description?: string;
        order: number;
      }>;
    },
    parentId?: Types.ObjectId,
  ): Promise<void> {
    const existingCategory = await this.categoryModel.findOne({
      slug: categoryData.slug,
    });

    let categoryId: Types.ObjectId;

    if (existingCategory) {
      this.logger.log(`Category "${categoryData.name}" already exists, skipping...`);
      categoryId = existingCategory._id as Types.ObjectId;
    } else {
      const categoryCreateData: Record<string, unknown> = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        order: categoryData.order,
        isActive: true,
      };
      if (parentId) {
        categoryCreateData.parent = parentId;
      }
      const newCategory = await this.categoryModel.create(categoryCreateData);
      categoryId = newCategory._id as Types.ObjectId;
      this.logger.log(`Created category: ${categoryData.name}`);
    }

    if (categoryData.children) {
      for (const child of categoryData.children) {
        await this.createCategoryWithChildren(child, categoryId);
      }
    }
  }
}
