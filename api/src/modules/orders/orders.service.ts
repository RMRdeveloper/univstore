import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OrdersRepository, type CreateOrderData } from './orders.repository.js';
import type { OrderDocument } from './schemas/order.schema.js';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(data: CreateOrderData): Promise<OrderDocument> {
    return this.ordersRepository.create(data);
  }

  async findByUser(userId: Types.ObjectId): Promise<OrderDocument[]> {
    return this.ordersRepository.findByUser(userId);
  }

  async findById(id: Types.ObjectId): Promise<OrderDocument> {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async countAll(): Promise<number> {
    return this.ordersRepository.countAll();
  }
}
