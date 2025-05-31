import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { settingsApi } from '../api/settings-api';
import { SettingsResponse } from '../types';
import { UpdateSettingsDto } from '../dto';
import { ApiResponse } from '@/shared/types';
interface SettingsState {
  // Data
  settings: SettingsResponse | null;

  // Loading states
  isLoading: boolean;

  // Error states
  error: string | null;

  // Actions
  getSettings: () => Promise<void>;
  getSettingsById: (id: number) => Promise<void>;
  updateSettings: (
    data: UpdateSettingsDto
  ) => Promise<ApiResponse<SettingsResponse>>;
  clearError: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      settings: null,
      isLoading: false,
      error: null,

      // Actions
      getSettings: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await settingsApi.getSettings();

          if (response.success) {
            set({ settings: response.data, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch settings',
            isLoading: false
          });
        }
      },

      getSettingsById: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await settingsApi.getSettingsById(id);
          if (response.success) {
            set({ settings: response.data, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch settings',
            isLoading: false
          });
        }
      },

      updateSettings: async (data: UpdateSettingsDto) => {
        try {
          set({ error: null, isLoading: true });
          const response = await settingsApi.updateSettings(data);

          console.log('settings response', response);

          if (response.success) {
            set({ settings: response.data, isLoading: false });
          }

          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to update settings';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw new Error(errorMessage);
        }
      },

      clearError: () => set({ error: null, isLoading: false })
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings
      })
    }
  )
);
