import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { adminApi } from '../api/admin-api';
import {
  AnalyticsPeriod,
  OverviewMetrics,
  NewUsersData,
  UserDistribution,
  UserActivityData
} from '../types';
import { AdminUser, UserRole } from '../types';
import { authApi } from '@/features/auth/api/auth-api';
import { ForgotPasswordCredentials } from '@/features/auth/types';

interface AdminState {
  users: AdminUser[];
  selectedUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  overviewMetrics: OverviewMetrics | null;
  newUsersData: NewUsersData | null;
  userDistribution: UserDistribution | null;
  userActivityData: UserActivityData[] | null;
  analyticsLoading: boolean;
  analyticsError: string | null;
  selectedPeriod: AnalyticsPeriod;
  fetchUsers: (query?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  updateUserRole: (id: number, role: UserRole) => Promise<AdminUser>;
  updateUserStatus: (id: number, isActive: boolean) => Promise<AdminUser>;
  resetUserPassword: (
    credentials: ForgotPasswordCredentials
  ) => Promise<{ message: string }>;
  updateUser: (
    id: number,
    data: { firstName: string; lastName: string; email: string }
  ) => Promise<AdminUser>;
  deleteUser: (id: number) => Promise<{ message: string }>;
  restoreUser: (id: number) => Promise<AdminUser>;
  setSelectedUser: (user: AdminUser | null) => void;
  fetchOverviewMetrics: (period: AnalyticsPeriod) => Promise<void>;
  fetchNewUsersData: (period: AnalyticsPeriod) => Promise<void>;
  fetchUserDistribution: (period: AnalyticsPeriod) => Promise<void>;
  fetchUserActivityData: (period: AnalyticsPeriod) => Promise<void>;
  fetchAllAnalytics: (period: AnalyticsPeriod) => Promise<void>;
  setSelectedPeriod: (period: AnalyticsPeriod) => void;
}

export const useAdminStore = create<AdminState>()(
  devtools((set, get) => ({
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
    overviewMetrics: null,
    newUsersData: null,
    userDistribution: null,
    userActivityData: null,
    analyticsLoading: false,
    analyticsError: null,
    selectedPeriod: 'monthly',

    fetchUsers: async (query = {}) => {
      try {
        set({ isLoading: true, error: null });
        const response = await adminApi.getAllUsers(query);

        if (!response.success) {
          throw new Error('Failed to fetch users');
        }

        const { users, total, page, totalPages, limit } = response.data;

        console.log('users from admin store :', users);
        set({ users, total, page, totalPages, limit, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchUserById: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const response = await adminApi.getUserById(id);

        if (!response.success) {
          throw new Error('Failed to fetch user');
        }

        set({ selectedUser: response.data, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    updateUserRole: async (id, role) => {
      try {
        set({ isLoading: true, error: null });
        const response = await adminApi.updateUserRole(id, role);

        if (!response.success) {
          throw new Error('Failed to update user role');
        }

        const updatedUser = response.data;
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? updatedUser : user
          ),
          selectedUser:
            state.selectedUser?.id === id ? updatedUser : state.selectedUser,
          isLoading: false
        }));
        return updatedUser;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    updateUserStatus: async (id, isActive) => {
      try {
        set({ isLoading: true, error: null });
        const response = await adminApi.updateUserStatus(id, isActive);

        if (!response.success) {
          throw new Error('Failed to update user status');
        }

        const updatedUser = response.data;
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? updatedUser : user
          ),
          selectedUser:
            state.selectedUser?.id === id ? updatedUser : state.selectedUser,
          isLoading: false
        }));
        return updatedUser;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    resetUserPassword: async (credentials: ForgotPasswordCredentials) => {
      try {
        set({ isLoading: true, error: null });
        const response = await authApi.forgotPassword(credentials);

        if (!response.success) {
          throw new Error('Failed to reset user password');
        }

        set({ isLoading: false });
        return response.data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    updateUser: async (id, data) => {
      try {
        set({ isLoading: true, error: null });
        const response = await adminApi.updateUser(id, data);

        if (!response.success) {
          throw new Error('Failed to update user');
        }

        const updatedUser = response.data;
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? updatedUser : user
          ),
          selectedUser:
            state.selectedUser?.id === id ? updatedUser : state.selectedUser,
          isLoading: false
        }));
        return updatedUser;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    deleteUser: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const response = await adminApi.updateUserStatus(id, false);

        if (!response.success) {
          throw new Error('Failed to delete user');
        }

        const updatedUser = response.data;
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? updatedUser : user
          ),
          selectedUser:
            state.selectedUser?.id === id ? updatedUser : state.selectedUser,
          isLoading: false
        }));
        return response.data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    restoreUser: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const response = await adminApi.updateUserStatus(id, true);

        if (!response.success) {
          throw new Error('Failed to restore user');
        }

        const updatedUser = response.data;
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? updatedUser : user
          ),
          selectedUser:
            state.selectedUser?.id === id ? updatedUser : state.selectedUser,
          isLoading: false
        }));
        return updatedUser;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    setSelectedUser: (user) => {
      set({ selectedUser: user });
    },

    fetchOverviewMetrics: async (period) => {
      try {
        set({ analyticsLoading: true, analyticsError: null });
        const response = await adminApi.getOverviewMetrics(period);

        if (!response.success) {
          throw new Error('Failed to fetch overview metrics');
        }

        set({ overviewMetrics: response.data, analyticsLoading: false });
      } catch (error) {
        set({
          analyticsError: (error as Error).message,
          analyticsLoading: false
        });
      }
    },

    fetchNewUsersData: async (period) => {
      try {
        const response = await adminApi.getNewUsersData(period);

        if (!response.success) {
          throw new Error('Failed to fetch new users data');
        }

        set({ newUsersData: response.data });
      } catch (error) {
        set({ analyticsError: (error as Error).message });
      }
    },

    fetchUserDistribution: async (period) => {
      try {
        const response = await adminApi.getUserDistribution(period);

        if (!response.success) {
          throw new Error('Failed to fetch user distribution');
        }

        set({ userDistribution: response.data });
      } catch (error) {
        set({ analyticsError: (error as Error).message });
      }
    },

    fetchUserActivityData: async (period) => {
      try {
        const response = await adminApi.getUserActivityData(period);

        if (!response.success) {
          throw new Error('Failed to fetch user activity data');
        }

        set({ userActivityData: response.data });
      } catch (error) {
        set({ analyticsError: (error as Error).message });
      }
    },

    fetchAllAnalytics: async (period) => {
      try {
        set({ analyticsLoading: true, analyticsError: null });

        await Promise.all([
          get().fetchOverviewMetrics(period),
          get().fetchNewUsersData(period),
          get().fetchUserDistribution(period),
          get().fetchUserActivityData(period)
        ]);

        set({ analyticsLoading: false });
      } catch (error) {
        set({
          analyticsError: (error as Error).message,
          analyticsLoading: false
        });
      }
    },

    setSelectedPeriod: (period) => {
      set({ selectedPeriod: period });
      get().fetchAllAnalytics(period);
    }
  }))
);
