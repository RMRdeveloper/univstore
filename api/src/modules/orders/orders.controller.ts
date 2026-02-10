import { Controller, Get, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { OrdersService } from './orders.service.js';
import type { OrderDocument } from './schemas/order.schema.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { UserRole } from '../../common/enums/index.js';
import type { JwtPayload } from '../cart/interfaces/jwt-payload.interface.js';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('stats/count')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getCount(): Promise<{ count: number }> {
    const count = await this.ordersService.countAll();
    return { count };
  }

  @Get()
  async list(@CurrentUser() user: JwtPayload): Promise<OrderDocument[]> {
    return this.ordersService.findByUser(user.sub);
  }

  @Get(':id')
  async getById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<OrderDocument> {
    const order = await this.ordersService.findById(id);
    if (order.user.toString() !== user.sub.toString()) {
      throw new ForbiddenException('Order does not belong to you');
    }
    return order;
  }
}
