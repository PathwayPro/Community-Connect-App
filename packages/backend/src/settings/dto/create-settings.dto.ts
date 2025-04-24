export interface CreateSettingsDto {
  shareBirthDate?: boolean;
  shareContactDetails?: boolean;
  shareSocialLinks?: boolean;
  profileVisibility?: 'public' | 'private' | 'connections';
  messageSettings?: 'everyone' | 'connections';
}
