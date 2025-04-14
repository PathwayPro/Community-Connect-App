import { useState } from 'react';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { ApiError } from '@/shared/types';
import { supportApi } from '@/features/support/api/support-api';
import { ContactFormData } from '@/features/support/types';

export function useSupport() {
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlertDialog();
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (formData: ContactFormData) => {
    try {
      setIsLoading(true);

      console.log('formData', formData);
      const response = await supportApi.submitContactForm(formData);

      if (response.success) {
        showAlert({
          title: 'Message Sent Successfully!',
          description:
            'Thank you for contacting us. We will get back to you soon.',
          type: 'success',
          redirect: '/'
        });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      const apiError = error as ApiError;
      showAlert({
        title: 'Submission Failed!',
        description:
          apiError.response?.data?.message || 'Please try again later.',
        type: 'error'
      });
      setError(
        apiError.response?.data?.message ||
          'An error occurred while submitting the form.'
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitContactForm,
    isLoading,
    error,
    setError
  };
}
