import { IsEnum } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsEnum(['pro', 'max'])
  plan: 'pro' | 'max';
}
