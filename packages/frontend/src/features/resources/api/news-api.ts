import { apiMethods } from '@/shared/api';
import { NewsItem } from '../types';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news-dto';
import { ApiResponse } from '@/shared/types';

export const newsApi = {
  createNews: (data: CreateNewsDto) =>
    apiMethods.post<ApiResponse<NewsItem>>('/news', data),

  getNews: () => apiMethods.get<ApiResponse<NewsItem[]>>('/news'),

  getNewsById: (id: string) =>
    apiMethods.get<ApiResponse<NewsItem>>(`/news/${id}`),

  updateNews: (id: string, data: UpdateNewsDto) =>
    apiMethods.patch<ApiResponse<NewsItem>>(`/news/${id}`, data),

  editNews: (id: string, data: UpdateNewsDto) =>
    apiMethods.put<ApiResponse<NewsItem>>(`/news/${id}`, data),

  deleteNews: (id: string) =>
    apiMethods.delete<ApiResponse<NewsItem>>(`/news/${id}`)
};
