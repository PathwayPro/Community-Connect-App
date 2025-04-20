import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { messageApi } from '../api/message-api';
import { CreateMessageDto } from '@/features/networking/dto/networking-dto';
import { Message, ChatPreview, MessageBubble } from '@/features/messages/types';

export interface MessageState {
  chatList: ChatPreview[];
  currentChat: MessageBubble[];
  selectedUserId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getChatList: () => Promise<void>;
  getChat: (userId: string) => Promise<void>;
  sendMessage: (data: CreateMessageDto) => Promise<void>;
  setSelectedUserId: (userId: string | null) => void;
  clearError: () => void;
  revalidate: () => Promise<void>;
}

export interface MessageItemProps {
  chat: ChatPreview;
  isSelected?: boolean;
  onClick: () => void;
}

export interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  sender: {
    first_name: string;
    last_name: string;
    picture_upload_link?: string;
  };
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      // Initial state
      chatList: [],
      currentChat: [],
      selectedUserId: null,
      isLoading: false,
      error: null,

      // Actions
      getChatList: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await messageApi.getChatList();

          if (response.success) {
            set({ chatList: response.data, isLoading: false });
          } else {
            set({
              error: response.message || 'Failed to fetch chat list',
              isLoading: false
            });
          }

          set({ chatList: response.data, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch chat list',
            isLoading: false
          });
        }
      },

      getChat: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await messageApi.getChat(userId);

          console.log('this is the response for getChat', response.data);

          if (response.success) {
            set({
              currentChat: response.data as unknown as MessageBubble[],
              selectedUserId: userId,
              isLoading: false
            });
          } else {
            set({
              error: response.message || 'Failed to fetch chat',
              isLoading: false
            });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Failed to fetch chat',
            isLoading: false
          });
        }
      },

      sendMessage: async (data: CreateMessageDto) => {
        try {
          set({ isLoading: true, error: null });
          const response = await messageApi.sendMessage(data);

          if (response.success) {
            await get().getChat(data.recipient_id.toString());
            await get().getChatList();
            set({ isLoading: false });
          } else {
            set({
              error: response.message || 'Failed to send message',
              isLoading: false
            });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Failed to send message',
            isLoading: false
          });
        }
      },

      setSelectedUserId: (userId: string | null) => {
        set({ selectedUserId: userId });
      },

      clearError: () => set({ error: null }),

      revalidate: async () => {
        const state = get();
        await state.getChatList();
        if (state.selectedUserId) {
          await state.getChat(state.selectedUserId);
        }
      }
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedUserId: state.selectedUserId
      })
    }
  )
);
