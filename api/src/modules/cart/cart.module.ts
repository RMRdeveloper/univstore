import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';
import { CartRepository } from './cart.repository.js';
import { Cart, CartSchema } from './schemas/cart.schema.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService],
})
export class CartModule { }
