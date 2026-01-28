import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import type { CartDocument } from './schemas/cart.schema.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';

import type { JwtPayload } from './interfaces';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: JwtPayload): Promise<CartDocument | null> {
    return this.cartService.getCart(user.sub);
  }

  @Post('items')
  async addItem(
    @CurrentUser() user: JwtPayload,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartDocument> {
    return this.cartService.addItem(user.sub, addToCartDto);
  }

  @Patch('items/:productId')
  async updateItem(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() updateDto: UpdateCartItemDto,
  ): Promise<CartDocument> {
    return this.cartService.updateItemQuantity(user.sub, productId, updateDto);
  }

  @Delete('items/:productId')
  async removeItem(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ): Promise<CartDocument> {
    return this.cartService.removeItem(user.sub, productId);
  }

  @Delete()
  async clearCart(@CurrentUser() user: JwtPayload): Promise<CartDocument> {
    return this.cartService.clearCart(user.sub);
  }
}
