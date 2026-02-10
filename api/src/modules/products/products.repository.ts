import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { SortOrder } from '../../common/enums/index.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductFilter {
  isActive?: boolean;
  category?: Types.ObjectId;
  price?: { $gte?: number; $lte?: number };
  stock?: { $gt: number };
  slug?: string;
  sku?: string;
  _id?: { $ne: Types.ObjectId };
}

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  async create(
    createProductDto: CreateProductDto & { slug: string },
  ): Promise<ProductDocument> {
    const product = new this.productModel({
      ...createProductDto,
      category: new Types.ObjectId(createProductDto.category),
    });
    return product.save();
  }

  async findAll(
    queryDto: ProductQueryDto,
  ): Promise<PaginatedResult<ProductDocument>> {
    const filter = this.buildFilter(queryDto);
    const { page = 1, limit = 12, sortBy, order } = queryDto;
    const skip = (page - 1) * limit;

    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortOptions[sortBy] = order === SortOrder.DESC ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug')
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: Types.ObjectId): Promise<ProductDocument | null> {
    return this.productModel.findById(id).populate('category', 'name slug').exec();
  }

  async findBySlug(slug: string): Promise<ProductDocument | null> {
    return this.productModel
      .findOne({ slug })
      .populate('category', 'name slug')
      .exec();
  }

  async findByCategory(
    categoryId: Types.ObjectId,
    queryDto: ProductQueryDto,
  ): Promise<PaginatedResult<ProductDocument>> {
    const filter = this.buildFilter({ ...queryDto, category: categoryId.toString() });
    const { page = 1, limit = 12, sortBy, order } = queryDto;
    const skip = (page - 1) * limit;

    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortOptions[sortBy] = order === SortOrder.DESC ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug')
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: Types.ObjectId,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument | null> {
    const updateData: Record<string, unknown> = { ...updateProductDto };
    if (updateProductDto.category) {
      updateData.category = new Types.ObjectId(updateProductDto.category);
    }
    return this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'name slug')
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<ProductDocument | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async decrementStock(
    productId: Types.ObjectId,
    quantity: number,
  ): Promise<ProductDocument | null> {
    return this.productModel
      .findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true },
      )
      .exec();
  }

  async existsBySlug(slug: string, excludeId?: Types.ObjectId): Promise<boolean> {
    const filter: ProductFilter = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const count = await this.productModel.countDocuments(filter).exec();
    return count > 0;
  }

  async existsBySku(sku: string, excludeId?: Types.ObjectId): Promise<boolean> {
    const filter: ProductFilter = { sku };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const count = await this.productModel.countDocuments(filter).exec();
    return count > 0;
  }

  private buildFilter(queryDto: ProductQueryDto): ProductFilter {
    const filter: ProductFilter = { isActive: true };

    if (queryDto.category) {
      filter.category = new Types.ObjectId(queryDto.category);
    }

    if (queryDto.minPrice !== undefined || queryDto.maxPrice !== undefined) {
      filter.price = {};
      if (queryDto.minPrice !== undefined) {
        filter.price.$gte = queryDto.minPrice;
      }
      if (queryDto.maxPrice !== undefined) {
        filter.price.$lte = queryDto.maxPrice;
      }
    }

    if (queryDto.inStock) {
      filter.stock = { $gt: 0 };
    }

    return filter;
  }
}
