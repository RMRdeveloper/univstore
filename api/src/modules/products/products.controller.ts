import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ProductsService } from './products.service.js';
import type { PaginatedResult } from './products.repository.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import type { ProductDocument } from './schemas/product.schema.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll(
    @Query() queryDto: ProductQueryDto,
  ): Promise<PaginatedResult<ProductDocument>> {
    return this.productsService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<ProductDocument> {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDocument> {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<void> {
    return this.productsService.delete(id);
  }
}
