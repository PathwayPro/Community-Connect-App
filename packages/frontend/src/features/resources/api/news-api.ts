import { apiMethods } from '@/shared/api';
import { News } from '../types';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news-dto';
import { ApiResponse } from '@/shared/types';

export const newsApi = {
  createNews: (data: CreateNewsDto) =>
    apiMethods.post<ApiResponse<News>>('/news', data),

  getNews: () => apiMethods.get<ApiResponse<News[]>>('/news'),

  getNewsById: (id: string) => apiMethods.get<ApiResponse<News>>(`/news/${id}`),

  updateNews: (id: string, data: UpdateNewsDto) =>
    apiMethods.patch<ApiResponse<News>>(`/news/${id}`, data),

  editNews: (id: string, data: UpdateNewsDto) =>
    apiMethods.put<ApiResponse<News>>(`/news/${id}`, data),

  deleteNews: (id: string) =>
    apiMethods.delete<ApiResponse<News>>(`/news/${id}`)
};
