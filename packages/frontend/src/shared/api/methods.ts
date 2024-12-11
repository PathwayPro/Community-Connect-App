import { api } from './axios-instance';
import { ApiResponse } from '../types';

export const apiMethods = {
  get: async <T>(url: string) => {
    const response = await api.get<ApiResponse<T>>(url);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown) => {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data: unknown) => {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data;
  },

  delete: async <T>(url: string) => {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data;
  }
};
