import { create } from 'zustand';
import { networkingApi } from '../api/networking-api';
import { Connection, ConnectionRequest, Message, ChatPreview } from '../types';
import {
  CreateConnectionRequestDto,
  UpdateConnectionRequestDto,
  CreateMessageDto,
  FilterConnectionRequestDto
} from '../dto/networking-dto';
import { userApi } from '@/features/user-profile/api/user-api';
import { UserProfile } from '@/features/user-profile/types';

interface NetworkingState {
  // Data
  connections: Connection[];
  connectionRequests: ConnectionRequest[];
  chatList: ChatPreview[];
  currentChat: Message[];
  networkingUsers: UserProfile[];

  // Loading states
  isLoading: boolean;

  // Error states
  error: string | null;

  // Actions
  getNetworkingUsers: () => Promise<void>;
  getConnections: () => Promise<void>;
  getConnectionRequests: (filters: FilterConnectionRequestDto) => Promise<void>;
  createConnectionRequest: (data: CreateConnectionRequestDto) => Promise<void>;
  updateConnectionRequest: (
    id: string,
    data: UpdateConnectionRequestDto
  ) => Promise<void>;
  getChatList: () => Promise<void>;
  getChat: (userId: string) => Promise<void>;
  sendMessage: (data: CreateMessageDto) => Promise<void>;
  clearError: () => void;
}

export const useNetworkingStore = create<NetworkingState>((set) => ({
  // Initial state
  connections: [],
  connectionRequests: [],
  chatList: [],
  currentChat: [],
  isLoading: false,
  error: null,
  networkingUsers: [],

  getNetworkingUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await userApi.getUsersPublicData();

      console.log('response of all users', response.data);
      if (response.success) {
        const networkingUsers = response.data.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          companyName: user.companyName,
          bio: user.bio,
          role: user.role,
          skills: user.skills,
          profession: user.profession,
          experience: user.experience,
          languages: user.languages,
          country: user.countryOfOrigin,
          pictureUploadLink: user.pictureUploadLink,
          linkedinLink: user.linkedinLink,
          githubLink: user.githubLink,
          twitterLink: user.twitterLink,
          portfolioLink: user.portfolioLink,
          isConnected: false
        }));

        console.log('networkingUsers', networkingUsers);

        const currentUser = await userApi.getUserProfile();

        console.log('currentUser', currentUser);

        // remove current user from the list
        const usersWithoutCurrentUser = networkingUsers.filter(
          (user) => user.id !== currentUser.data.id
        );

        set({ networkingUsers: usersWithoutCurrentUser, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      });
    }
  },

  // Actions
  getConnections: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await networkingApi.getConnections();
      set({ connections: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch connections',
        isLoading: false
      });
    }
  },

  getConnectionRequests: async (filters) => {
    try {
      set({ isLoading: true, error: null });
      const response = await networkingApi.getConnectionRequests(filters);
      set({ connectionRequests: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch connection requests',
        isLoading: false
      });
    }
  },

  createConnectionRequest: async (data) => {
    try {
      set({ error: null, isLoading: true });
      const response = await networkingApi.createConnectionRequest(data);
      set((state) => ({
        connectionRequests: [...state.connectionRequests, response.data.data],
        isLoading: false
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create connection request'
      });
    }
  },

  updateConnectionRequest: async (id, data) => {
    try {
      set({ error: null, isLoading: true });
      const response = await networkingApi.updateConnectionRequest(id, data);
      set((state) => ({
        connectionRequests: state.connectionRequests.map((request) =>
          request.id === response.data.data.id ? response.data.data : request
        ),
        isLoading: false
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update connection request',
        isLoading: false
      });
    }
  },

  getChatList: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await networkingApi.getChatList();
      set({ chatList: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch chat list',
        isLoading: false
      });
    }
  },

  getChat: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await networkingApi.getChat(userId);
      set({ currentChat: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch chat',
        isLoading: false
      });
    }
  },

  sendMessage: async (data) => {
    try {
      set({ error: null, isLoading: true });
      const response = await networkingApi.sendMessage(data);
      set((state) => ({
        currentChat: [...state.currentChat, response.data.data],
        isLoading: false
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to send message',
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null, isLoading: false })
}));
