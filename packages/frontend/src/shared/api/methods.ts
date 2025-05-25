import { api } from './axios-instance';
import { ApiResponse } from '../types';

export const apiMethods = {
  get: async <T>(url: string) => {
    const response = await api.get<ApiResponse<T>>(url);
    return response.data;
  },

  // post: async <T>(url: string, data?: unknown) => {
  //   const response = await api.post<ApiResponse<T>>(url, data);
  //   return response.data;
  // },

  post: async <T>(
    url: string,
    data?: FormData | unknown,
    headers?: Record<string, string>
  ) => {
    if (data instanceof FormData) {
      for (const pair of data.entries()) {
        console.log('FormData entry in api methods:', pair[0], pair[1]);
      }
    }

    const response = await api.post<ApiResponse<T>>(url, data, { headers });
    return response.data;
  },

  put: async <T>(
    url: string,
    data: FormData | unknown,
    headers?: Record<string, string>
  ) => {
    if (data instanceof FormData) {
      // Log FormData contents for debugging
      for (const pair of data.entries()) {
        console.log('FormData entry in PUT request:', pair[0], pair[1]);
      }
    }

    const response = await api.put<ApiResponse<T>>(url, data, { headers });
    return response.data;
  },

  patch: async <T>(
    url: string,
    data: FormData | unknown,
    headers?: Record<string, string>
  ) => {
    console.log('data in patch method: ', data);

    if (data instanceof FormData) {
      for (const pair of data.entries()) {
        console.log('FormData entry in PATCH request:', pair[0], pair[1]);
      }
    }

    const response = await api.patch<ApiResponse<T>>(url, data, { headers });
    return response.data;
  },

  delete: async <T>(url: string) => {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data;
  }
};
