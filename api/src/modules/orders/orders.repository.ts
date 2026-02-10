import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderItem } from './schemas/order.schema.js';

export interface CreateOrderData {
  user: Types.ObjectId;
  items: OrderItem[];
  total: number;
  status: string;
}

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(data: CreateOrderData): Promise<OrderDocument> {
    const order = new this.orderModel(data);
    await order.save();
    return this.orderModel
      .findById(order._id)
      .populate('items.product', 'name slug price images')
      .exec() as Promise<OrderDocument>;
  }

  async findById(id: Types.ObjectId): Promise<OrderDocument | null> {
    return this.orderModel
      .findById(id)
      .populate('items.product', 'name slug price images')
      .exec();
  }

  async findByUser(userId: Types.ObjectId): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name slug price images')
      .exec();
  }

  async countAll(): Promise<number> {
    return this.orderModel.countDocuments().exec();
  }
}
