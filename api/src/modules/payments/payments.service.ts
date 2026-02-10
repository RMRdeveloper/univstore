import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { ProductsService } from '../products/products.service.js';
import type { OrderDocument } from '../orders/schemas/order.schema.js';
import type { OrderItem } from '../orders/schemas/order.schema.js';

interface PopulatedProduct {
  price: number;
  _id: Types.ObjectId;
  title?: string;
}

interface CartItemPayload {
  product: PopulatedProduct | Types.ObjectId;
  quantity: number;
  priceAtAdd: number;
}

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly cartService: CartService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
  ) {
    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    const stripeConfig: Stripe.StripeConfig = {
      apiVersion: '2025-12-15.clover' as Stripe.StripeConfig['apiVersion'],
    };

    this.stripe = new Stripe(apiKey, stripeConfig);
  }

  async createPaymentIntent(
    userId: string,
  ): Promise<{ clientSecret: string | null }> {
    const userObjectId = new Types.ObjectId(userId);
    const cart = await this.cartService.getCart(userObjectId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Empty cart');
    }

    // Force strict type mapping for the reduce operation
    const items = cart.items as unknown as CartItemPayload[];

    const totalAmount = items.reduce(
      (sum: number, item: CartItemPayload) =>
        sum + item.priceAtAdd * item.quantity,
      0,
    );

    if (totalAmount <= 0) {
      throw new BadRequestException('Invalid total amount');
    }

    try {
      // Use official Stripe interfaces for all parameters
      const params: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(totalAmount * 100),
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: { userId: String(userId) },
      };

      const paymentIntent: Stripe.PaymentIntent =
        await this.stripe.paymentIntents.create(params);

      return { clientSecret: paymentIntent.client_secret };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Stripe Error';
      throw new BadRequestException(message);
    }
  }

  async confirmOrderFromCart(userId: string): Promise<OrderDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const cart = await this.cartService.getCart(userObjectId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Empty cart');
    }

    const items = cart.items as unknown as CartItemPayload[];

    // Validate stock before any changes
    for (const item of items) {
      const productId =
        item.product instanceof Types.ObjectId
          ? item.product
          : (item.product as PopulatedProduct)._id;
      const product = await this.productsService.findById(productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }
    }

    // Decrement stock for each item
    for (const item of items) {
      const productId =
        item.product instanceof Types.ObjectId
          ? item.product
          : (item.product as PopulatedProduct)._id;
      await this.productsService.decrementStock(productId, item.quantity);
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      product:
        item.product instanceof Types.ObjectId
          ? item.product
          : (item.product as PopulatedProduct)._id,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtAdd,
    }));

    const total = orderItems.reduce(
      (sum, i) => sum + i.priceAtPurchase * i.quantity,
      0,
    );

    const order = await this.ordersService.create({
      user: userObjectId,
      items: orderItems,
      total,
      status: 'completed',
    });

    await this.cartService.clearCart(userObjectId);

    return order;
  }
}
