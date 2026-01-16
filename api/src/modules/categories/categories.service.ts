import {
  Injectable,
  NotFoundException,
  ConflictException,
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
    const slug = this.generateSlug(createCategoryDto.name);

    const slugExists = await this.categoriesRepository.existsBySlug(slug);
    if (slugExists) {
      throw new ConflictException('A category with this name already exists');
    }

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
      const slug = this.generateSlug(updateCategoryDto.name);
      const slugExists = await this.categoriesRepository.existsBySlug(slug, id);
      if (slugExists) {
        throw new ConflictException('A category with this name already exists');
      }
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

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }
}
