import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/billing.dto';

@ApiTags('billing')
@Controller('api/billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  createCheckout(@CurrentUser() user: User, @Body() dto: CreateCheckoutSessionDto) {
    return this.billing.createCheckoutSession(user, dto.plan);
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Open Stripe billing portal' })
  openPortal(@CurrentUser() user: User) {
    return this.billing.openBillingPortal(user);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook receiver (raw body, no auth)' })
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'] as string;
    await this.billing.handleWebhook(req.rawBody!, sig);
    return { received: true };
  }
}
