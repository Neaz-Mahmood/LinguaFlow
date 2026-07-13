import { IsIn, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsIn(['en', 'es', 'fr', 'de'])
  uiLocale?: 'en' | 'es' | 'fr' | 'de';

  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  themeMode?: 'light' | 'dark' | 'system';
}
