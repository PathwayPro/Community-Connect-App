import { MessageSettings, ProfileVisibility } from '@prisma/client';

export interface UpdateSettingsDto {
  shareBirthDate?: boolean;
  shareContactDetails?: boolean;
  shareSocialLinks?: boolean;
  profileVisibility?: ProfileVisibility; //'public' | 'private' | 'connections';
  messageSettings?: MessageSettings; //'everyone' | 'connections';
}
