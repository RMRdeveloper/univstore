import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import slugify from 'slugify';
import {
  ProductsRepository,
  type PaginatedResult,
} from './products.repository.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import type { ProductDocument } from './schemas/product.schema.js';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const slug = this.generateSlug(createProductDto.name);

    const slugExists = await this.productsRepository.existsBySlug(slug);
    if (slugExists) {
      throw new ConflictException('A product with this name already exists');
    }

    const skuExists = await this.productsRepository.existsBySku(createProductDto.sku);
    if (skuExists) {
      throw new ConflictException('A product with this SKU already exists');
    }

    return this.productsRepository.create({ ...createProductDto, slug });
  }

  async findAll(
    queryDto: ProductQueryDto,
  ): Promise<PaginatedResult<ProductDocument>> {
    return this.productsRepository.findAll(queryDto);
  }

  async findById(id: Types.ObjectId): Promise<ProductDocument> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findBySlug(slug: string): Promise<ProductDocument> {
    const product = await this.productsRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findByCategory(
    categoryId: Types.ObjectId,
    queryDto: ProductQueryDto,
  ): Promise<PaginatedResult<ProductDocument>> {
    return this.productsRepository.findByCategory(categoryId, queryDto);
  }

  async update(
    id: Types.ObjectId,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    if (updateProductDto.name) {
      const slug = this.generateSlug(updateProductDto.name);
      const slugExists = await this.productsRepository.existsBySlug(slug, id);
      if (slugExists) {
        throw new ConflictException('A product with this name already exists');
      }
    }

    if (updateProductDto.sku) {
      const skuExists = await this.productsRepository.existsBySku(
        updateProductDto.sku,
        id,
      );
      if (skuExists) {
        throw new ConflictException('A product with this SKU already exists');
      }
    }

    const product = await this.productsRepository.update(id, updateProductDto);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async delete(id: Types.ObjectId): Promise<void> {
    const product = await this.productsRepository.delete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }
}
