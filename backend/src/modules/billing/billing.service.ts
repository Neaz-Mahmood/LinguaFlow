import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { User } from '../../entities/user.entity';
import { StripeCustomer } from '../../entities/stripe-customer.entity';
import { StripeSubscription } from '../../entities/stripe-subscription.entity';
import { planForPrice } from '../entitlements/plan-config';

@Injectable()
export class BillingService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(StripeCustomer) private readonly customers: Repository<StripeCustomer>,
    @InjectRepository(StripeSubscription) private readonly subscriptions: Repository<StripeSubscription>,
  ) {
    this.stripe = new Stripe(config.get<string>('STRIPE_SECRET_KEY') || 'missing', {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(user: User, plan: 'pro' | 'max'): Promise<{ url: string }> {
    const priceId = plan === 'pro'
      ? this.config.get<string>('STRIPE_PRICE_PRO')
      : this.config.get<string>('STRIPE_PRICE_MAX');
    if (!priceId) throw new BadRequestException(`Stripe price for ${plan} is not configured.`);

    const customerId = await this.getOrCreateStripeCustomer(user);
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.config.get('STRIPE_SUCCESS_URL')}?billing=success&plan=${plan}`,
      cancel_url: `${this.config.get('STRIPE_CANCEL_URL')}?billing=cancel`,
      metadata: { userId: String(user.id), plan },
    });
    return { url: session.url! };
  }

  async openBillingPortal(user: User): Promise<{ url: string }> {
    const customerId = await this.getOrCreateStripeCustomer(user);
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: this.config.get('STRIPE_SUCCESS_URL'),
    });
    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, sig: string): Promise<void> {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') || '';
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, secret);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${(err as Error).message}`);
    }

    // Idempotency: skip already-processed events.
    const eventId = event.id;
    this.logger.log({ event: 'stripe_webhook', type: event.type, eventId });

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.cancelSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await this.markPastDue((event.data.object as Stripe.Invoice).customer as string);
        break;
      default:
        break;
    }
  }

  // --- helpers ---

  private async getOrCreateStripeCustomer(user: User): Promise<string> {
    const existing = await this.customers.findOne({ where: { userId: user.id } });
    if (existing) return existing.stripeCustomerId;

    const customer = await this.stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: { userId: String(user.id) },
    });
    await this.customers.save(
      this.customers.create({ userId: user.id, stripeCustomerId: customer.id }),
    );
    await this.users.update(user.id, { stripeCustomerId: customer.id });
    return customer.id;
  }

  private async syncSubscription(sub: Stripe.Subscription): Promise<void> {
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    const customer = await this.customers.findOne({ where: { stripeCustomerId: customerId } });
    if (!customer) {
      this.logger.warn({ event: 'stripe_customer_not_found', customerId });
      return;
    }
    const priceId = sub.items.data[0]?.price?.id ?? '';
    const plan = planForPrice(priceId);
    const planStatus = sub.status === 'active' || sub.status === 'trialing' ? 'active' : sub.status as any;

    await this.users.update(customer.userId, { plan, planStatus });
    await this.subscriptions.upsert(
      {
        userId: customer.userId,
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId,
        status: sub.status,
        currentPeriodStart: new Date((sub as any).current_period_start * 1000),
        currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      },
      ['stripeSubscriptionId'],
    );
    this.logger.log({ event: 'subscription_synced', userId: customer.userId, plan, status: sub.status });
  }

  private async cancelSubscription(sub: Stripe.Subscription): Promise<void> {
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    const customer = await this.customers.findOne({ where: { stripeCustomerId: customerId } });
    if (!customer) return;
    await this.users.update(customer.userId, { plan: 'free', planStatus: 'canceled' });
    await this.subscriptions.update(
      { stripeSubscriptionId: sub.id },
      { status: 'canceled' },
    );
    this.logger.log({ event: 'subscription_canceled', userId: customer.userId });
  }

  private async markPastDue(customerId: string): Promise<void> {
    const customer = await this.customers.findOne({ where: { stripeCustomerId: customerId } });
    if (!customer) return;
    await this.users.update(customer.userId, { planStatus: 'past_due' });
    this.logger.log({ event: 'subscription_past_due', userId: customer.userId });
  }
}
