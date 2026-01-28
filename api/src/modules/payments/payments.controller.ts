import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service'; // SIN .js

interface RequestWithUser {
  user: {
    sub: string;
    userId?: string;
    _id?: string;
  };
}

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  createIntent(@Request() req: RequestWithUser) {
    const userId = req.user.userId || req.user.sub || req.user._id;

    return this.paymentsService.createPaymentIntent(userId as string);
  }
}
