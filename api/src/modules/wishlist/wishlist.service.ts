import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { WishlistRepository } from './wishlist.repository.js';
import { ProductsService } from '../products/products.service.js';
import type { WishlistDocument } from './schemas/wishlist.schema.js';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productsService: ProductsService,
  ) { }

  async getWishlist(userId: Types.ObjectId): Promise<WishlistDocument | null> {
    return this.wishlistRepository.findByUser(userId);
  }

  async addProduct(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<WishlistDocument> {
    await this.productsService.findById(productId);
    return this.wishlistRepository.addProduct(userId, productId);
  }

  async removeProduct(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<WishlistDocument> {
    const wishlist = await this.wishlistRepository.removeProduct(userId, productId);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async hasProduct(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<boolean> {
    return this.wishlistRepository.hasProduct(userId, productId);
  }
}
