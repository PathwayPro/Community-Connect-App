import { apiMethods } from '@/shared/api';
import { ContactUsResponse, Subscription } from '@/features/support/types';
import {
  ContactUsDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto
} from '../dto';

export const supportApi = {
  submitContactForm: (data: ContactUsDto) =>
    apiMethods.post<ContactUsResponse>('/contact-us', data),

  subscribeToNewsletter: (data: CreateSubscriptionDto) =>
    apiMethods.post<Subscription>('/contact-us/subscribe', data),

  unsubscribeFromNewsletter: (data: UpdateSubscriptionDto) =>
    apiMethods.post<Subscription>('/contact-us/unsubscribe', data)
};
