import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, UserResponse } from '../types';
import { userApi } from '../api/user-api';

interface UserState {
  user: UserProfile | null;
  users: UserProfile[];
  publicUsers: UserProfile[];
  selectedUser: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserProfile: () => Promise<UserResponse<UserProfile>>;
  fetchUsers: () => Promise<UserResponse<UserProfile[]>>;
  fetchUsersPublicData: () => Promise<UserResponse<UserProfile[]>>;
  fetchUserPublicData: (id: number) => Promise<UserResponse<UserProfile>>;
  fetchUserById: (id: number) => Promise<UserResponse<UserProfile>>;
  fetchUserByEmail: (email: string) => Promise<UserResponse<UserProfile>>;
  updateUser: (
    data: UserProfile,
    id: number
  ) => Promise<UserResponse<UserProfile>>;
  deleteUser: (id: number) => Promise<UserResponse<UserProfile>>;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      users: [],
      publicUsers: [],
      selectedUser: null,
      isLoading: false,
      error: null,

      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.getUserProfile();
          set({ user: response.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to fetch user profile', isLoading: false });
          throw error;
        }
      },

      fetchUsers: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.getUsers();
          set({ users: response.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to fetch users', isLoading: false });
          throw error;
        }
      },

      fetchUsersPublicData: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.getUsersPublicData();
          set({ publicUsers: response.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to fetch public users data', isLoading: false });
          throw error;
        }
      },

      fetchUserPublicData: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.getUserPublicData(id);
          set({ selectedUser: response.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to fetch user public data', isLoading: false });
          throw error;
        }
      },

      fetchUserById: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.getUserById(id);
          set({ selectedUser: response.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to fetch user by ID', isLoading: false });
          throw error;
        }
      },

      fetchUserByEmail: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.getUserByEmail(email);
          set({ selectedUser: response.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to fetch user by email', isLoading: false });
          throw error;
        }
      },

      updateUser: async (data: UserProfile, id: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.updateUserProfile(data, id);
          const usersResponse = await userApi.getUsers();
          set({ users: usersResponse.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to update user', isLoading: false });
          throw error;
        }
      },

      deleteUser: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.deleteUserProfile(id);
          set((state) => ({
            users: state.users.filter((user) => user.id !== id),
            isLoading: false
          }));
          return response;
        } catch (error) {
          set({ error: 'Failed to delete user', isLoading: false });
          throw error;
        }
      },

      reset: () => {
        set({
          user: null,
          users: [],
          publicUsers: [],
          selectedUser: null,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        users: state.users,
        publicUsers: state.publicUsers,
        selectedUser: state.selectedUser
      })
    }
  )
);
