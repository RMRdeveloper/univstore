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
      // We don't need to check for existence here because getUniqueSlug guarantees uniqueness
      // But we need to update the dto with the new slug? 
      // The current update logic in repository likely takes the whole object.
      // Wait, the repository update method takes existing DTO.
      // I need to inject the slug into the update process. 
      // The repository update logic:
      /*
      async update(id, updateCategoryDto) {
        const updateData = { ...updateCategoryDto };
        ...
        return this.categoryModel.findByIdAndUpdate(id, updateData, ...);
      }
      */
      // So I can't just pass slug separately unless I modify DTO or Repository.
      // Easiest is to cast or modify the DTO object before passing, but DTO is typed.
      // Or I can add 'slug' to updateCategoryDto if it allows, but it doesn't seem to based on typical NestJS mapped-types.
      // Let's modify the repository call if needed or just pass it as part of a modified object.
      // Actually, standard practice: pass a new object.

      const updateData = { ...updateCategoryDto, slug };
      // Passing updateData which counts as UpdateCategoryDto if it overlaps sufficient properties?
      // No, UpdateCategoryDto probably doesn't have 'slug'.
      // Let's check UpdateCategoryDto definition later, but usually slug is auto-generated.
      // I will assume I can pass it to repository.update which takes UpdateCategoryDto. 
      // If UpdateCategoryDto is strict, I might need to cast or change repository signature. 
      // Looking at repository: `updateCategoryDto: UpdateCategoryDto`
      // `const updateData: Record<string, unknown> = { ...updateCategoryDto };`
      // It copies properties. So if I pass an object with slug, it will be copied.
      // So I will cast it as any or intersection.
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
    // Append unique suffix
    return `${slug}-${crypto.randomUUID().split('-')[0]}`;
  }
}
