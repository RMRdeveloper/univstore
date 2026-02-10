import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';

interface PopulatedProduct {
  price: number;
  _id: Types.ObjectId;
  title: string;
}

interface CartItem {
  product: PopulatedProduct;
  quantity: number;
}

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly cartService: CartService) {
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
    const items = cart.items as unknown as CartItem[];

    const totalAmount = items.reduce((sum: number, item: CartItem): number => {
      return sum + item.product.price * item.quantity;
    }, 0);

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
}
