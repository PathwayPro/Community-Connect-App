export interface CreateSettingsDto {
  shareBirthDate?: boolean;
  shareContactDetails?: boolean;
  shareSocialLinks?: boolean;
  profileVisibility?: 'public' | 'private' | 'connections';
  messageSettings?: 'everyone' | 'connections';
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateSettingsDto extends CreateSettingsDto {}
