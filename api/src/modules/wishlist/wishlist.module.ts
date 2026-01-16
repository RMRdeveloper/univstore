import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { WishlistController } from './wishlist.controller.js';
import { WishlistService } from './wishlist.service.js';
import { WishlistRepository } from './wishlist.repository.js';
import { Wishlist, WishlistSchema } from './schemas/wishlist.schema.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: Wishlist.name, schema: WishlistSchema }]),
    ProductsModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService, WishlistRepository],
  exports: [WishlistService],
})
export class WishlistModule { }
