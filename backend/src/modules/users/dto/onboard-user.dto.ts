import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class OnboardUserDto {
  @ApiProperty({ example: 'Spanish' })
  @IsString()
  @MinLength(1)
  target_language: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  native_language?: string;

  @ApiProperty({ example: 'A1' })
  @IsString()
  @MinLength(1)
  current_level: string;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsNumber()
  daily_commitment: number;

  @ApiProperty({
    example: 'input-heavy',
    description: 'input-heavy | output-first | balanced',
  })
  @IsString()
  @MinLength(1)
  strategy_preference: string;

  @ApiPropertyOptional({ type: [String], example: ['travel', 'conversation'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];
}
