export interface SettingsResponse {
  id: number;
  userId: number;
  shareBirthDate?: boolean;
  shareContactDetails?: boolean;
  shareSocialLinks?: boolean;
  profileVisibility?: 'public' | 'private' | 'connections';
  messageSettings?: 'everyone' | 'connections';
}
