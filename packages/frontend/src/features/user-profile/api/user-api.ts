import { apiMethods } from '@/shared/api';
import { UserProfile } from '../types';

export const userApi = {
  getUserProfile: () => apiMethods.get<UserProfile>('/user/profile'),

  getUsers: () => apiMethods.get<UserProfile[]>('/users')
};