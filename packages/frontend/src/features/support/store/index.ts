import { create } from 'zustand';
import { supportApi } from '../api/support-api';
import { ContactUsResponse, Subscription } from '../types';
import {
  ContactUsDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto
} from '../dto';

interface SupportState {
  // Data
  response: ContactUsResponse | null;
  subscriptionResponse: Subscription | null;

  // Loading states
  isSubmitting: boolean;

  // Success state
  isSuccess: boolean;

  // Error states
  error: string | null;

  // Actions
  submitContactForm: (data: ContactUsDto) => Promise<void>;
  subscribeToNewsletter: (data: CreateSubscriptionDto) => Promise<void>;
  unsubscribeFromNewsletter: (data: UpdateSubscriptionDto) => Promise<void>;
  resetForm: () => void;
  clearError: () => void;
}

export const useSupportStore = create<SupportState>()((set) => ({
  // Initial state
  response: null,
  subscriptionResponse: null,
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

  subscribeToNewsletter: async (data: CreateSubscriptionDto) => {
    try {
      const response = await supportApi.subscribeToNewsletter(data);

      if (response.success) {
        set({
          subscriptionResponse: response.data,
          isSubmitting: false,
          isSuccess: true
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to subscribe to newsletter',
        isSubmitting: false,
        isSuccess: false
      });
    }
  },

  unsubscribeFromNewsletter: async (data: UpdateSubscriptionDto) => {
    try {
      const response = await supportApi.unsubscribeFromNewsletter(data);

      if (response.success) {
        set({
          subscriptionResponse: response.data,
          isSubmitting: false,
          isSuccess: true
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to unsubscribe from newsletter',
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
