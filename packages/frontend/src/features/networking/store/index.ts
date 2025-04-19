import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { networkingApi } from '../api/networking-api';
import { Connection, ConnectionRequest } from '../types';
import { Message, ChatPreview } from '@/features/messages/types';
import {
  CreateConnectionRequestDto,
  UpdateConnectionRequestDto
} from '../dto/networking-dto';

interface NetworkingState {
  // Data
  connections: Connection[];
  connectionRequests: ConnectionRequest[];
  chatList: ChatPreview[];
  currentChat: Message[];

  // Loading states
  isLoading: boolean;

  // Error states
  error: string | null;

  // Actions
  getConnections: () => Promise<void>;
  getConnectionRequests: () => Promise<void>;
  createConnectionRequest: (data: CreateConnectionRequestDto) => Promise<void>;
  updateConnectionRequest: (
    id: string,
    data: UpdateConnectionRequestDto
  ) => Promise<void>;
  clearError: () => void;
  revalidate: () => void;
}

export const useNetworkingStore = create<NetworkingState>()(
  persist(
    (set) => ({
      // Initial state
      connections: [],
      connectionRequests: [],
      chatList: [],
      currentChat: [],
      isLoading: false,
      error: null,

      // Actions
      getConnections: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await networkingApi.getConnections();

          if (response.success) {
            set({ connections: response.data, isLoading: false });
          }
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

      getConnectionRequests: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await networkingApi.getConnectionRequests();

          console.log('response of connection requests', response.data);

          if (response.success) {
            set({ connectionRequests: response.data, isLoading: false });
          }
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

          if (response.success) {
            // Reload connection requests after creating new one
            const updatedRequests = await networkingApi.getConnectionRequests();
            set({
              connectionRequests: updatedRequests.data,
              isLoading: false
            });
          }
          set((state) => {
            const newState = { ...state, isLoading: false };
            newState.revalidate();
            return newState;
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to create connection request',
            isLoading: false
          });
        }
      },

      updateConnectionRequest: async (id, data) => {
        try {
          set({ error: null, isLoading: true });
          const response = await networkingApi.updateConnectionRequest(
            id,
            data
          );

          if (response.success) {
            // Reload connection requests after updating
            const updatedRequests = await networkingApi.getConnectionRequests();
            set({
              connectionRequests: updatedRequests.data,
              isLoading: false
            });
          }
          set((state) => {
            const newState = { ...state, isLoading: false };
            newState.revalidate();
            return newState;
          });
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

      clearError: () => set({ error: null, isLoading: false }),

      revalidate: () => {
        set((state) => ({ ...state }));
      }
    }),
    {
      name: 'networking-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        connections: state.connections,
        connectionRequests: state.connectionRequests,
        chatList: state.chatList,
        currentChat: state.currentChat
      })
    }
  )
);
