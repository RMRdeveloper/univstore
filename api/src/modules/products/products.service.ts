import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
    const slug = await this.getUniqueSlug(createProductDto.name);

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
    const updateData: Record<string, any> = { ...updateProductDto };

    if (updateProductDto.name) {
      const slug = await this.getUniqueSlug(updateProductDto.name, id);
      updateData.slug = slug;
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

    const product = await this.productsRepository.update(id, updateData as any);
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

  async decrementStock(
    productId: Types.ObjectId,
    quantity: number,
  ): Promise<ProductDocument> {
    const product = await this.productsRepository.decrementStock(
      productId,
      quantity,
    );
    if (!product) {
      throw new BadRequestException(
        'Product not found or insufficient stock',
      );
    }
    return product;
  }

  private async getUniqueSlug(name: string, excludeId?: Types.ObjectId): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true });
    const exists = await this.productsRepository.existsBySlug(slug, excludeId);
    if (!exists) {
      return slug;
    }
    return `${slug}-${crypto.randomUUID().split('-')[0]}`;
  }
}
