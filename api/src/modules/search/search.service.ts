import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema.js';
import { SearchQueryDto } from './dto/search-query.dto.js';
import { SortOrder } from '../../common/enums/index.js';
import type { PaginatedResult } from '../products/products.repository.js';

interface SearchFilter {
  isActive?: boolean;
  $text?: { $search: string };
  category?: Types.ObjectId;
  price?: { $gte?: number; $lte?: number };
  stock?: { $gt: number };
}

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  async search(
    queryDto: SearchQueryDto,
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

  private buildFilter(queryDto: SearchQueryDto): SearchFilter {
    const filter: SearchFilter = { isActive: true };

    if (queryDto.q) {
      filter.$text = { $search: queryDto.q };
    }

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
