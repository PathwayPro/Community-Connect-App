import { apiMethods } from '@/shared/api';
import { News } from '../types';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news-dto';

export const newsApi = {
  createNews: (data: CreateNewsDto) => apiMethods.post<News>('/news', data),

  getNews: () => apiMethods.get<News[]>('/news'),

  getNewsById: (id: string) => apiMethods.get<News>(`/news/${id}`),

  updateNews: (id: string, data: UpdateNewsDto) =>
    apiMethods.put<News>(`/news/${id}`, data),

  editNews: (id: string, data: FormData | UpdateNewsDto) => {
    console.log('data in news api fileeee : ', data);

    return apiMethods.patch<News>(`/news/${id}`, data);
  },

  deleteNews: (id: string) => apiMethods.delete<News>(`/news/${id}`)
};
