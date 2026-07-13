import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class MineFlashcardDto {
  @ApiProperty({ example: 'hola' })
  @IsString()
  @MinLength(1)
  word: string;

  @ApiProperty({ example: 'hello' })
  @IsString()
  @MinLength(1)
  translation: string;

  @ApiPropertyOptional({ example: '¡Hola! ¿Cómo estás?' })
  @IsOptional()
  @IsString()
  context_sentence?: string;

  @ApiPropertyOptional({ example: 'Hello! How are you?' })
  @IsOptional()
  @IsString()
  context_translation?: string;
}

export class ReviewFlashcardDto {
  @ApiProperty({
    description: 'SM-2 quality rating from 0 (forgot) to 5 (perfect)',
    minimum: 0,
    maximum: 5,
    example: 4,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  quality: number;
}
