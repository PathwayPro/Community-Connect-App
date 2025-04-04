import { create } from 'zustand';
import { NewsItem } from '../types';
import { newsApi } from '../api/news-api';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news-dto';

interface NewsStore {
  // State
  news: NewsItem[];
  currentNews: NewsItem | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNews: () => Promise<void>;
  fetchNewsById: (id: string) => Promise<void>;
  createNews: (data: CreateNewsDto) => Promise<void>;
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
      set({ news: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchNewsById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.getNewsById(id);
      set({ currentNews: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createNews: async (data: CreateNewsDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.createNews(data);
      set((state) => ({
        news: [...state.news, response.data.data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateNews: async (id: string, data: UpdateNewsDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.updateNews(id, data);
      set((state) => ({
        news: state.news.map((item) =>
          item.id === id ? response.data.data : item
        ),
        currentNews: response.data.data,
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  editNews: async (id: string, data: UpdateNewsDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await newsApi.editNews(id, data);
      set((state) => ({
        news: state.news.map((item) =>
          item.id === id ? response.data.data : item
        ),
        currentNews: response.data.data,
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteNews: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await newsApi.deleteNews(id);
      set((state) => ({
        news: state.news.filter((item) => item.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
