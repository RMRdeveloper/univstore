import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { CategoriesRepository } from './categories.repository.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import type { CategoryDocument } from './schemas/category.schema.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    const slug = await this.getUniqueSlug(createCategoryDto.name);
    return this.categoriesRepository.create({ ...createCategoryDto, slug });
  }

  async findAll(includeInactive = false): Promise<CategoryDocument[]> {
    return this.categoriesRepository.findAll(includeInactive);
  }

  async findById(id: Types.ObjectId): Promise<CategoryDocument> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoriesRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findRootCategories(): Promise<CategoryDocument[]> {
    return this.categoriesRepository.findRootCategories();
  }

  async findChildren(parentId: Types.ObjectId): Promise<CategoryDocument[]> {
    return this.categoriesRepository.findChildren(parentId);
  }

  async update(
    id: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    if (updateCategoryDto.name) {
      const slug = await this.getUniqueSlug(updateCategoryDto.name, id);
      const updateData = { ...updateCategoryDto, slug };
      const category = await this.categoriesRepository.update(id, updateData as any);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    }

    if (updateCategoryDto.parent === id.toString()) {
      throw new BadRequestException('A category cannot be its own parent');
    }

    const category = await this.categoriesRepository.update(id, updateCategoryDto);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async delete(id: Types.ObjectId): Promise<void> {
    const hasChildren = await this.categoriesRepository.hasChildren(id);
    if (hasChildren) {
      throw new BadRequestException(
        'Cannot delete a category that has subcategories',
      );
    }

    const category = await this.categoriesRepository.delete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private async getUniqueSlug(name: string, excludeId?: Types.ObjectId): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true });
    const exists = await this.categoriesRepository.existsBySlug(slug, excludeId);
    if (!exists) {
      return slug;
    }
    return `${slug}-${crypto.randomUUID().split('-')[0]}`;
  }
}
