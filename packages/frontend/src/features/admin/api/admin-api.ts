import { apiMethods } from '@/shared/api';
import { AdminUser, UserRole } from '../types';

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface OverviewMetrics {
  totalUsers: number;
  userGrowthRate: number;
  engagementRate: number;
  engagementRateChange: number;
  deletedUsers: number;
  unverifiedUsers: number;
}

export interface NewUsersData {
  currentValue: number;
  chartData: Array<{ label: string; value: number }>;
}

export interface UserDistribution {
  totalUsers: number;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export interface UserActivityData {
  type: string;
  count: number;
}

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
    apiMethods.delete<{ message: string }>(`/users/${id}`),

  // Analytics methods
  getOverviewMetrics: (period: AnalyticsPeriod) =>
    apiMethods.get<OverviewMetrics>('/admin/analytics/overview', {
      params: { period }
    }),

  getNewUsersData: (period: AnalyticsPeriod) =>
    apiMethods.get<NewUsersData>('/admin/analytics/new-users', {
      params: { period }
    }),

  getUserDistribution: (period: AnalyticsPeriod) =>
    apiMethods.get<UserDistribution>('/admin/analytics/user-distribution', {
      params: { period }
    }),

  getUserActivityData: (period: AnalyticsPeriod) =>
    apiMethods.get<UserActivityData[]>('/admin/analytics/user-activity', {
      params: { period }
    })
};
