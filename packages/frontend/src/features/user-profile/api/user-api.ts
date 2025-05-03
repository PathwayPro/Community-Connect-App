import { apiMethods } from '@/shared/api';
import { SkillsResponse, UserProfile } from '../types';

export const userApi = {
  getUserProfile: () => apiMethods.get<UserProfile>('/users/profile'),

  getUsers: () => apiMethods.get<UserProfile[]>('/users/all'),

  getUsersPublicData: () => apiMethods.get<UserProfile[]>(`/users/public-data`),

  getUserPublicData: (id: number) =>
    apiMethods.get<UserProfile>(`/users/public-data/${id}`),

  getUserById: (id: number) => apiMethods.get<UserProfile>(`/users/${id}`),

  getUserByEmail: (email: string) =>
    apiMethods.get<UserProfile>(`/users/email/${email}`),

  updateUserProfile: (data: UserProfile, id: number) =>
    apiMethods.put<UserProfile>(`/users/${id}`, data),

  deleteUserProfile: (id: number) =>
    apiMethods.delete<UserProfile>(`/users/${id}`),

  getSkills: () => apiMethods.get<SkillsResponse[]>('/skills')
};
