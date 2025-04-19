import { apiMethods } from '@/shared/api';
import { Message } from '../types';
import { CreateMessageDto } from '@/features/networking/dto/networking-dto';
import { ChatPreview } from '@/features/messages/types';

export const messageApi = {
  sendMessage: (data: CreateMessageDto) =>
    apiMethods.post<Message>('/networking/messages', data),

  getChatList: () => apiMethods.get<ChatPreview[]>('/networking/messages/list'),

  getChat: (userId: string) =>
    apiMethods.get<Message[]>(`/networking/messages/${userId}`)
};
