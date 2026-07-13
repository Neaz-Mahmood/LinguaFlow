import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class EvaluateShadowingDto {
  @ApiProperty({ example: 'Buenos días, ¿cómo está usted?' })
  @IsString()
  @MinLength(1)
  target_sentence: string;

  @ApiPropertyOptional({ example: 'Buenos dias como esta usted' })
  @IsOptional()
  @IsString()
  transcript?: string;
}

export class QuickOutputReplyDto {
  @ApiProperty({ example: 'The man went to the market.' })
  @IsString()
  @MinLength(1)
  message: string;

  @ApiProperty({ example: 'A Day in Madrid' })
  @IsString()
  @MinLength(1)
  story_title: string;
}
