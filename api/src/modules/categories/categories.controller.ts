import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import type { CategoryDocument } from './schemas/category.schema.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  async findAll(): Promise<CategoryDocument[]> {
    return this.categoriesService.findAll();
  }

  @Get('roots')
  async findRoots(): Promise<CategoryDocument[]> {
    return this.categoriesService.findRootCategories();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<CategoryDocument> {
    return this.categoriesService.findById(id);
  }

  @Get(':id/children')
  async findChildren(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<CategoryDocument[]> {
    return this.categoriesService.findChildren(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<CategoryDocument> {
    return this.categoriesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<void> {
    return this.categoriesService.delete(id);
  }
}
