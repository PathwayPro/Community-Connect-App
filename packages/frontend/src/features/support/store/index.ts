import { create } from 'zustand';
import { supportApi } from '../api/support-api';
import { ContactUsResponse } from '../types';
import { ContactUsDto } from '../dto';

interface SupportState {
  // Data
  response: ContactUsResponse | null;

  // Loading states
  isSubmitting: boolean;

  // Success state
  isSuccess: boolean;

  // Error states
  error: string | null;

  // Actions
  submitContactForm: (data: ContactUsDto) => Promise<void>;
  resetForm: () => void;
  clearError: () => void;
}

export const useSupportStore = create<SupportState>()((set) => ({
  // Initial state
  response: null,
  isSubmitting: false,
  isSuccess: false,
  error: null,

  // Actions
  submitContactForm: async (data: ContactUsDto) => {
    console.log('contact form data', data);
    try {
      set({ isSubmitting: true, error: null, isSuccess: false });
      const response = await supportApi.submitContactForm(data);

      if (response.success) {
        set({
          response: response.data,
          isSubmitting: false,
          isSuccess: true
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to submit contact form',
        isSubmitting: false,
        isSuccess: false
      });
    }
  },

  resetForm: () =>
    set({
      response: null,
      isSuccess: false,
      error: null
    }),

  clearError: () => set({ error: null })
}));
