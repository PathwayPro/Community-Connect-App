import { ProfileVisibility } from '@prisma/client';

export interface SettingsEntity {
  id: number;
  userId: number;
  shareBirthDate: boolean;
  shareContactDetails: boolean;
  shareSocialLinks: boolean;
  profileVisibility: ProfileVisibility;
}
