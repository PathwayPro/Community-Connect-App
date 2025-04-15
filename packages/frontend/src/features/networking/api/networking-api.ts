import { apiMethods } from '@/shared/api';
import { Connection, ConnectionRequest, Message, ChatPreview } from '../types';
import {
  CreateConnectionRequestDto,
  UpdateConnectionRequestDto,
  CreateMessageDto,
  FilterConnectionRequestDto
} from '../dto/networking-dto';

export const networkingApi = {
  // Connection Requests
  createConnectionRequest: (data: CreateConnectionRequestDto) =>
    apiMethods.post<ConnectionRequest>('/networking/connect', data),

  updateConnectionRequest: (id: string, data: UpdateConnectionRequestDto) =>
    apiMethods.put<ConnectionRequest>(`/networking/connect/${id}`, data),

  getConnectionRequests: (filters: FilterConnectionRequestDto) =>
    apiMethods.get<ConnectionRequest[]>(`/networking/connect?${filters}`),

  getConnectionRequest: (id: string) =>
    apiMethods.get<ConnectionRequest>(`/networking/connect/${id}`),

  getConnections: () => apiMethods.get<Connection[]>('/networking/connected'),

  // Messages
  sendMessage: (data: CreateMessageDto) =>
    apiMethods.post<Message>('/networking/messages', data),

  getChatList: () => apiMethods.get<ChatPreview[]>('/networking/messages/list'),

  getChat: (userId: string) =>
    apiMethods.get<Message[]>(`/networking/messages/${userId}`)
};
