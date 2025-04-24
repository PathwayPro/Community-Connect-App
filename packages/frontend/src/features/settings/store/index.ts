import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { settingsApi } from '../api/settings-api';
import { SettingsResponse } from '../types';
import { CreateSettingsDto, UpdateSettingsDto } from '../dto';

interface SettingsState {
  // Data
  settings: SettingsResponse | null;

  // Loading states
  isLoading: boolean;

  // Error states
  error: string | null;

  // Actions
  getSettings: () => Promise<void>;
  createSettings: (data: CreateSettingsDto) => Promise<void>;
  updateSettings: (id: number, data: UpdateSettingsDto) => Promise<void>;
  deleteSettings: (id: number) => Promise<void>;
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

      createSettings: async (data) => {
        try {
          set({ error: null, isLoading: true });
          const response = await settingsApi.createSettings(data);

          if (response.success) {
            set({ settings: response.data, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to create settings',
            isLoading: false
          });
        }
      },

      updateSettings: async (id, data) => {
        try {
          set({ error: null, isLoading: true });
          const response = await settingsApi.updateSettings(id, data);

          if (response.success) {
            set({ settings: response.data, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to update settings',
            isLoading: false
          });
        }
      },

      deleteSettings: async (id) => {
        try {
          set({ error: null, isLoading: true });
          const response = await settingsApi.deleteSettings(id);

          if (response.success) {
            set({ settings: null, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to delete settings',
            isLoading: false
          });
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
