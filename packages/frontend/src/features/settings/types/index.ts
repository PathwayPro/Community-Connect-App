export enum ProfileVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  CONNECTIONS_ONLY = 'CONNECTIONS_ONLY'
}

export interface SettingsResponse {
  id: number;
  userId: number;
  shareBirthDate?: boolean;
  shareContactDetails?: boolean;
  shareSocialLinks?: boolean;
  profileVisibility?: ProfileVisibility;
}
