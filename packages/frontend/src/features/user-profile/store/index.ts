import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, UserResponse, SkillsResponse } from '../types';
import { userApi } from '../api/user-api';
import React from 'react';
interface UserState {
  user: UserProfile | null;
  users: UserProfile[];
  skills: SkillsResponse[];
  professions: string[];
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
  fetchSkills: () => Promise<UserResponse<SkillsResponse[]>>;
  fetchProfessions: () => Promise<UserResponse<string[]>>;
  updateUser: (
    data: FormData | UserProfile,
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
      skills: [],
      professions: [],
      publicUsers: [],
      selectedUser: null,
      isLoading: false,
      error: null,

      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await userApi.getUserProfile();

          console.log('response IN STORE', response);

          if (!response.success) {
            throw new Error('Failed to fetch user profile');
          }

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

      fetchSkills: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.getSkills();
          set({ skills: response.data, isLoading: false });
          return response;
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : 'An error occurred';
          set({ error: errorMsg, isLoading: false });
          // Return a UserResponse object instead of undefined
          return { success: false, data: [], message: errorMsg };
        }
      },

      fetchProfessions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.getProfessions();
          set({ professions: response.data, isLoading: false });
          return response;
        } catch (error) {
          set({ error: 'Failed to fetch professions', isLoading: false });
          throw error;
        }
      },

      updateUser: async (data: FormData | UserProfile, id: number) => {
        try {
          console.log('data in update user store: ', data);

          if (data instanceof FormData) {
            console.log('FormData in store before API call:');
            for (const pair of data.entries()) {
              console.log(pair[0], pair[1]);
            }
          }

          set({ isLoading: true, error: null });

          const response = await userApi.updateUserProfile(data, id);

          if (!response.success) {
            throw new Error('Failed to update user');
          }

          set({ user: response.data, isLoading: false });

          return response;
        } catch (error) {
          console.error('Error in updateUser:', error);
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

// Add a hook to fetch user profile on store initialization
export const useInitializeUserStore = () => {
  const { fetchUserProfile } = useUserStore();

  React.useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
};
