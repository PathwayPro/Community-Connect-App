import { apiMethods } from '@/shared/api';
import { UserProfile, UserResponse } from '../types';

export const userApi = {
  getUserProfile: () => apiMethods.get<UserProfile>('/users/profile'),

  getUsers: () => apiMethods.get<UserProfile[]>('/users'),

  updateUserProfile: (data: UserProfile, id: number) =>
    apiMethods.put<UserResponse>(`/users/${id}`, data),

  deleteUserProfile: (id: number) =>
    apiMethods.delete<UserProfile>(`/users/${id}`)
};
