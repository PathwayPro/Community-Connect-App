import { ProfileVisibility } from '@prisma/client';

export interface CreateSettingsDto {
  shareBirthDate?: boolean;
  shareContactDetails?: boolean;
  shareSocialLinks?: boolean;
  profileVisibility?: ProfileVisibility; //'public' | 'private' | 'connections';
}
