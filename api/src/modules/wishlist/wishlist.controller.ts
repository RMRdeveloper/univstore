import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { WishlistService } from './wishlist.service.js';
import type { WishlistDocument } from './schemas/wishlist.schema.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { UserRole } from '../../common/enums/index.js';

interface JwtPayload {
  sub: Types.ObjectId;
  email: string;
  role: UserRole;
}

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Get()
  async getWishlist(
    @CurrentUser() user: JwtPayload,
  ): Promise<WishlistDocument | null> {
    return this.wishlistService.getWishlist(user.sub);
  }

  @Post(':productId')
  async addProduct(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ): Promise<WishlistDocument> {
    return this.wishlistService.addProduct(user.sub, productId);
  }

  @Delete(':productId')
  async removeProduct(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ): Promise<WishlistDocument> {
    return this.wishlistService.removeProduct(user.sub, productId);
  }
}
