import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

interface CategoryFilter {
  isActive?: boolean;
  slug?: string;
  parent?: Types.ObjectId | null;
  _id?: { $ne: Types.ObjectId };
}

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) { }

  async create(
    createCategoryDto: CreateCategoryDto & { slug: string },
  ): Promise<CategoryDocument> {
    const categoryData: Record<string, unknown> = {
      ...createCategoryDto,
    };
    if (createCategoryDto.parent) {
      categoryData.parent = new Types.ObjectId(createCategoryDto.parent);
    }
    const category = new this.categoryModel(categoryData);
    return category.save();
  }

  async findAll(includeInactive = false): Promise<CategoryDocument[]> {
    const filter: CategoryFilter = includeInactive ? {} : { isActive: true };
    return this.categoryModel
      .find(filter)
      .sort({ order: 1, name: 1 })
      .populate('parent', 'name slug')
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<CategoryDocument | null> {
    return this.categoryModel
      .findById(id)
      .populate('parent', 'name slug')
      .exec();
  }

  async findBySlug(slug: string): Promise<CategoryDocument | null> {
    return this.categoryModel
      .findOne({ slug })
      .populate('parent', 'name slug')
      .exec();
  }

  async findRootCategories(): Promise<CategoryDocument[]> {
    return this.categoryModel
      .find({ parent: null, isActive: true })
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async findChildren(parentId: Types.ObjectId): Promise<CategoryDocument[]> {
    return this.categoryModel
      .find({ parent: parentId, isActive: true })
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async update(
    id: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument | null> {
    const updateData: Record<string, unknown> = { ...updateCategoryDto };
    if (updateCategoryDto.parent) {
      updateData.parent = new Types.ObjectId(updateCategoryDto.parent);
    }
    return this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('parent', 'name slug')
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<CategoryDocument | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  async existsBySlug(slug: string, excludeId?: Types.ObjectId): Promise<boolean> {
    const filter: CategoryFilter = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const count = await this.categoryModel.countDocuments(filter).exec();
    return count > 0;
  }

  async hasChildren(id: Types.ObjectId): Promise<boolean> {
    const count = await this.categoryModel.countDocuments({ parent: id }).exec();
    return count > 0;
  }
}
