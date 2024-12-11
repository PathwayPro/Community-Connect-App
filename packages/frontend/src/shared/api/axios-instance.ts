import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokens } from '@/shared/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokens.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = tokens.getRefreshToken();

        if (!refreshToken) {
          tokens.clear();
          throw new Error('No refresh token available');
        }

        // Call your refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        tokens.set({ accessToken, refreshToken: newRefreshToken });

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        tokens.clear();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);
