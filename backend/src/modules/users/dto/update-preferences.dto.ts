import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: ['en', 'es', 'fr', 'de'], example: 'en' })
  @IsOptional()
  @IsIn(['en', 'es', 'fr', 'de'])
  uiLocale?: 'en' | 'es' | 'fr' | 'de';

  @ApiPropertyOptional({ enum: ['light', 'dark', 'system'], example: 'system' })
  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  themeMode?: 'light' | 'dark' | 'system';
}
