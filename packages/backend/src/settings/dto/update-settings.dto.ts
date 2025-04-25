import { ProfileVisibility } from '@prisma/client';
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsBoolean()
  shareBirthDate?: boolean;

  @IsOptional()
  @IsBoolean()
  shareContactDetails?: boolean;

  @IsOptional()
  @IsBoolean()
  shareSocialLinks?: boolean;

  @IsOptional()
  @IsEnum(ProfileVisibility)
  profileVisibility?: ProfileVisibility;
}
