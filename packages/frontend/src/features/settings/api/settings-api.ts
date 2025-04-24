import { apiMethods } from '@/shared/api';
import { UpdateSettingsDto } from '../dto';
import { SettingsResponse } from '../types';

export const settingsApi = {
  getSettings: () => apiMethods.get<SettingsResponse>('/settings'),

  updateSettings: (data: UpdateSettingsDto) =>
    apiMethods.put<SettingsResponse>(`/settings/update`, data),

  deleteSettings: (id: number) =>
    apiMethods.delete<SettingsResponse>(`/settings/${id}`)
};
