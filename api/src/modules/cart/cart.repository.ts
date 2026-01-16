import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument, CartItem } from './schemas/cart.schema.js';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) { }

  async findByUser(userId: Types.ObjectId): Promise<CartDocument | null> {
    return this.cartModel
      .findOne({ user: userId })
      .populate('items.product', 'name slug price images stock')
      .exec();
  }

  async findOrCreate(userId: Types.ObjectId): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
      await cart.save();
    }
    return cart;
  }

  async addItem(
    userId: Types.ObjectId,
    item: CartItem,
  ): Promise<CartDocument> {
    const cart = await this.findOrCreate(userId);
    const existingIndex = cart.items.findIndex(
      (i) => i.product.toString() === item.product.toString(),
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    await cart.save();
    return this.cartModel
      .findById(cart._id)
      .populate('items.product', 'name slug price images stock')
      .exec() as Promise<CartDocument>;
  }

  async updateItemQuantity(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    quantity: number,
  ): Promise<CartDocument | null> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) return null;

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId.toString(),
    );

    if (itemIndex < 0) return null;

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return this.cartModel
      .findById(cart._id)
      .populate('items.product', 'name slug price images stock')
      .exec();
  }

  async removeItem(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<CartDocument | null> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) return null;

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId.toString(),
    );
    await cart.save();

    return this.cartModel
      .findById(cart._id)
      .populate('items.product', 'name slug price images stock')
      .exec();
  }

  async clear(userId: Types.ObjectId): Promise<CartDocument | null> {
    return this.cartModel
      .findOneAndUpdate(
        { user: userId },
        { items: [] },
        { new: true },
      )
      .populate('items.product', 'name slug price images stock')
      .exec();
  }
}
