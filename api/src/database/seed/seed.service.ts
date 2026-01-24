import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../../modules/categories/schemas/category.schema.js';
import { categoriesSeed } from './data/categories.seed.js';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) { }

  async onApplicationBootstrap() {
    await this.seedCategories();
  }

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
    const categoryDataToSave: Record<string, unknown> = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      order: categoryData.order,
      isActive: true,
    };

    if (parentId) {
      categoryDataToSave.parent = parentId;
    }

    const category = await this.categoryModel.findOneAndUpdate(
      { slug: categoryData.slug },
      { $set: categoryDataToSave },
      { upsert: true, new: true, lean: false },
    );

    const categoryId = category._id as Types.ObjectId;

    if (categoryData.children) {
      for (const child of categoryData.children) {
        await this.createCategoryWithChildren(child, categoryId);
      }
    }
  }
}
