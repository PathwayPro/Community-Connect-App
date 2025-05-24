import { apiMethods } from '@/shared/api';
import { AdminUser, UserRole } from '../types';

export const adminApi = {
  getAllUsers: (query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) =>
    apiMethods.get<{
      users: AdminUser[];
      total: number;
      page: number;
      totalPages: number;
      limit: number;
    }>('/admin/users', { params: query }),

  getUserById: (id: number) => apiMethods.get<AdminUser>(`/admin/users/${id}`),

  updateUserRole: (id: number, role: UserRole) =>
    apiMethods.put<AdminUser>(`/admin/users/${id}/role`, { role }),

  updateUserStatus: (id: number, isActive: boolean) =>
    apiMethods.put<AdminUser>(`/admin/users/${id}/status`, { isActive }),

  updateUser: (
    id: number,
    data: { firstName: string; lastName: string; email: string }
  ) => apiMethods.put<AdminUser>(`/admin/users/${id}`, data),

  deleteUser: (id: number) =>
    apiMethods.delete<{ message: string }>(`/users/${id}`)
};
