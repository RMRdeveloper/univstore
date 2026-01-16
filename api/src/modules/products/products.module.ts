import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { ProductsRepository } from './products.repository.js';
import { Product, ProductSchema } from './schemas/product.schema.js';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule { }
