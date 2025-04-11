import { create } from 'zustand';
import { News } from '../types';
import { newsApi } from '../api/news-api';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news-dto';

interface NewsStore {
  // State
  news: News[];
  currentNews: News | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNews: () => Promise<void>;
  fetchNewsById: (id: string) => Promise<void>;
  createNews: (data: CreateNewsDto) => Promise<News | null>;
  updateNews: (id: string, data: UpdateNewsDto) => Promise<void>;
  editNews: (id: string, data: UpdateNewsDto) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  // Initial state
  news: [],
  currentNews: null,
  isLoading: false,
  error: null,

  // Actions
  fetchNews: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.getNews();

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch news');
      }

      set({ news: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchNewsById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.getNewsById(id);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch news item');
      }

      set({ currentNews: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  createNews: async (data: CreateNewsDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.createNews(data);

      if (!response?.success) {
        const errorMessage = response?.message || 'Failed to create news';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const newNews = response.data.data;
      set((state) => ({
        news: Array.isArray(state.news) ? [...state.news, newNews] : [newNews],
        isLoading: false
      }));

      return newNews;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create news';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateNews: async (id: string, data: UpdateNewsDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.updateNews(id, data);

      if (response.success) {
        set((state) => ({
          news: Array.isArray(state.news)
            ? state.news.map((item) =>
                item.id === id ? response.data.data : item
              )
            : [response.data.data],
          currentNews: response.data.data,
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  editNews: async (id: string, data: UpdateNewsDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.editNews(id, data);

      if (response.success) {
        set((state) => ({
          news: state.news.map((item) =>
            item.id === id ? response.data.data : item
          ),
          currentNews: response.data.data,
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteNews: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.deleteNews(id);

      if (response.success) {
        set((state) => ({
          news: state.news.filter((item) => item.id !== id),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
