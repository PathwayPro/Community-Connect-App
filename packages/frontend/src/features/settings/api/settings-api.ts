import { apiMethods } from '@/shared/api';
import { UpdateSettingsDto, CreateSettingsDto } from '../dto';
import { SettingsResponse } from '../types';

export const settingsApi = {
  getSettings: () => apiMethods.get<SettingsResponse>('/settings'),

  createSettings: (data: CreateSettingsDto) =>
    apiMethods.post<SettingsResponse>('/settings', data),

  updateSettings: (id: number, data: UpdateSettingsDto) =>
    apiMethods.patch<SettingsResponse>(`/settings/${id}`, data),

  deleteSettings: (id: number) =>
    apiMethods.delete<SettingsResponse>(`/settings/${id}`)
};
