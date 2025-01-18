import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, UserResponse } from '../types';
import { userApi } from '../api/user-api';

interface UserState {
  user: UserProfile | null;
  users: UserProfile[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserProfile: () => Promise<UserResponse>;
  //   fetchUsers: () => Promise<UserResponse>;
  //   updateUser: (data: UserProfile, id: number) => Promise<UserResponse>;
  //   deleteUser: (id: number) => Promise<UserResponse>;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      users: [],
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

      //   fetchUsers: async () => {
      //     try {
      //       set({ isLoading: true, error: null });
      //       const response = await userApi.getUsers();
      //       set({ users: response.data, isLoading: false });
      //       return response;
      //     } catch (error) {
      //       set({ error: 'Failed to fetch users', isLoading: false });
      //       throw error;
      //     }
      //   },

      //   updateUser: async (data: UserProfile, id: number) => {
      //     try {
      //       set({ isLoading: true, error: null });
      //       const response = await userApi.updateUserProfile(data, id);
      //       const usersResponse = await userApi.getUsers();
      //       set({ users: usersResponse.data, isLoading: false });
      //       return response;
      //     } catch (error) {
      //       set({ error: 'Failed to update user', isLoading: false });
      //       throw error;
      //     }
      //   },

      //   deleteUser: async (id: number) => {
      //     try {
      //       set({ isLoading: true, error: null });
      //       const response = await userApi.deleteUserProfile(id);
      //       set((state) => ({
      //         users: state.users.filter((user) => user.id !== id),
      //         isLoading: false
      //       }));
      //       return response;
      //     } catch (error) {
      //       set({ error: 'Failed to delete user', isLoading: false });
      //       throw error;
      //     }
      //   },

      reset: () => {
        set({
          user: null,
          users: [],
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
        users: state.users
      })
    }
  )
);
