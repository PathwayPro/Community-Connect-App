import { ProfileVisibility } from '../types';

export interface UpdateSettingsDto {
  shareBirthDate?: boolean;
  shareContactDetails?: boolean;
  shareSocialLinks?: boolean;
  profileVisibility?: ProfileVisibility;
}
