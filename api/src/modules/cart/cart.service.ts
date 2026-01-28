import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepository } from './cart.repository.js';
import { ProductsService } from '../products/products.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import type { CartDocument } from './schemas/cart.schema.js';
import { PopulatedCartItem } from './interfaces/populated-cart-item.interface.js';
@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productsService: ProductsService,
  ) {}

  async getCart(userId: Types.ObjectId): Promise<CartDocument | null> {
    return this.cartRepository.findByUser(userId);
  }

  async addItem(
    userId: Types.ObjectId,
    addToCartDto: AddToCartDto,
  ): Promise<CartDocument> {
    const productId = new Types.ObjectId(addToCartDto.productId);
    const product = await this.productsService.findById(productId);

    if (product.stock < addToCartDto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    return this.cartRepository.addItem(userId, {
      product: productId,
      quantity: addToCartDto.quantity,
      priceAtAdd: product.price,
    });
  }

  async updateItemQuantity(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    updateDto: UpdateCartItemDto,
  ): Promise<CartDocument> {
    const product = await this.productsService.findById(productId);

    if (product.stock < updateDto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const cart = await this.cartRepository.updateItemQuantity(
      userId,
      productId,
      updateDto.quantity,
    );

    if (!cart) {
      throw new NotFoundException('Item not found in cart');
    }

    return cart;
  }

  async removeItem(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<CartDocument> {
    const cart = await this.cartRepository.removeItem(userId, productId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }
  async calculateTotal(userId: Types.ObjectId): Promise<number> {
    const cart = await this.cartRepository.findByUser(userId);

    if (!cart || !cart.items.length) {
      return 0;
    }

    const total = cart.items.reduce((sum, item) => {
      const populatedItem = item as unknown as PopulatedCartItem;

      return sum + populatedItem.product.price * populatedItem.quantity;
    }, 0);

    return total;
  }
  async clearCart(userId: Types.ObjectId): Promise<CartDocument> {
    const cart = await this.cartRepository.clear(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }
}
