import { apiMethods } from '@/shared/api';
import { ApiResponse } from '@/shared/types';
import { ContactFormData } from '@/features/support/types';

export const supportApi = {
  submitContactForm: (data: ContactFormData) =>
    apiMethods.post<ApiResponse<ContactFormData>>('/support/contact', data)
};
