import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

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
    const raw = req.user.userId ?? req.user.sub ?? req.user._id;
    const userId = raw?.toString?.() ?? String(raw ?? '');

    return this.paymentsService.createPaymentIntent(userId);
  }
}
