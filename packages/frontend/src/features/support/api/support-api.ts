import { apiMethods } from '@/shared/api';
import { ContactUsResponse } from '@/features/support/types';
import { ContactUsDto } from '../dto';

export const supportApi = {
  submitContactForm: (data: ContactUsDto) =>
    apiMethods.post<ContactUsResponse>('/contact-us', data)
};
