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

  updateUserProfile: (data: FormData | UserProfile, id: number) => {
    console.log('data in user api: ', data);

    if (data instanceof FormData) {
      for (const pair of data.entries()) {
        console.log(pair[0], ':', pair[1]);
      }
    }

    return apiMethods.patch<UserProfile>(`/users/${id}`, data);
  },

  deleteUserProfile: (id: number) =>
    apiMethods.delete<UserProfile>(`/users/${id}`),

  getSkills: () => apiMethods.get<SkillsResponse[]>('/skills'),

  getProfessions: () => apiMethods.get<string[]>('/users/professions'),

  // file view
  fileView: (path: string) => apiMethods.get<string>(`/files/${path}`)
};
