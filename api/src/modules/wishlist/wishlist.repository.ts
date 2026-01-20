import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema.js';

@Injectable()
export class WishlistRepository {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
  ) { }

  async findByUser(userId: Types.ObjectId): Promise<WishlistDocument | null> {
    return this.wishlistModel
      .findOne({ user: userId })
      .populate({
        path: 'products',
        select: 'name slug price images stock isActive category',
        populate: { path: 'category', select: 'name slug' },
      })
      .exec();
  }

  async findOrCreate(userId: Types.ObjectId): Promise<WishlistDocument> {
    let wishlist = await this.wishlistModel.findOne({ user: userId }).exec();
    if (!wishlist) {
      wishlist = new this.wishlistModel({ user: userId, products: [] });
      await wishlist.save();
    }
    return wishlist;
  }

  async addProduct(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<WishlistDocument> {
    const wishlist = await this.findOrCreate(userId);

    const exists = wishlist.products.some(
      (p) => p.toString() === productId.toString(),
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    return this.wishlistModel
      .findById(wishlist._id)
      .populate({
        path: 'products',
        select: 'name slug price images stock isActive category',
        populate: { path: 'category', select: 'name slug' },
      })
      .exec() as Promise<WishlistDocument>;
  }

  async removeProduct(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<WishlistDocument | null> {
    const wishlist = await this.wishlistModel.findOne({ user: userId }).exec();
    if (!wishlist) return null;

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId.toString(),
    );
    await wishlist.save();

    return this.wishlistModel
      .findById(wishlist._id)
      .populate({
        path: 'products',
        select: 'name slug price images stock isActive category',
        populate: { path: 'category', select: 'name slug' },
      })
      .exec();
  }

  async hasProduct(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<boolean> {
    const wishlist = await this.wishlistModel.findOne({ user: userId }).exec();
    if (!wishlist) return false;
    return wishlist.products.some((p) => p.toString() === productId.toString());
  }
}
