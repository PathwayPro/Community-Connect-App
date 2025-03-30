import { apiMethods } from '@/shared/api';
import { Connection, ConnectionRequest, Message, ChatPreview } from '../types';
import {
  CreateConnectionRequestDto,
  UpdateConnectionRequestDto,
  CreateMessageDto,
  FilterConnectionRequestDto
} from '../dto/networking-dto';
import { ApiResponse } from '@/shared/types';

export const networkingApi = {
  // Connection Requests
  createConnectionRequest: (data: CreateConnectionRequestDto) =>
    apiMethods.post<ApiResponse<ConnectionRequest>>(
      '/networking/connect',
      data
    ),

  updateConnectionRequest: (id: string, data: UpdateConnectionRequestDto) =>
    apiMethods.put<ApiResponse<ConnectionRequest>>(
      `/networking/connect/${id}`,
      data
    ),

  getConnectionRequests: (filters: FilterConnectionRequestDto) =>
    apiMethods.get<ApiResponse<ConnectionRequest[]>>(
      `/networking/connect?${filters}`
    ),

  getConnectionRequest: (id: string) =>
    apiMethods.get<ApiResponse<ConnectionRequest>>(`/networking/connect/${id}`),

  getConnections: () =>
    apiMethods.get<ApiResponse<Connection[]>>('/networking/connected'),

  // Messages
  sendMessage: (data: CreateMessageDto) =>
    apiMethods.post<ApiResponse<Message>>('/networking/messages', data),

  getChatList: () =>
    apiMethods.get<ApiResponse<ChatPreview[]>>('/networking/messages/list'),

  getChat: (userId: string) =>
    apiMethods.get<ApiResponse<Message[]>>(`/networking/messages/${userId}`)
};
