import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { News } from '../types';
import { newsApi } from '../api/news-api';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news-dto';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/shared/types';
interface NewsStore {
  // State
  news: News[];
  currentNews: News | null;
  isLoading: boolean;
  error: string | null;
  router?: ReturnType<typeof useRouter>;

  // Actions
  fetchNews: () => Promise<void>;
  fetchNewsById: (id: string) => Promise<void>;
  createNews: (data: CreateNewsDto) => Promise<News | null>;
  updateNews: (id: string, data: UpdateNewsDto) => Promise<void>;
  editNews: (id: string, data: FormData) => Promise<ApiResponse<News>>;
  deleteNews: (id: string) => Promise<boolean | undefined>;
  clearError: () => void;
  revalidate: () => void;
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      // Initial state
      news: [],
      currentNews: null,
      isLoading: false,
      error: null,
      router: undefined,

      // Actions
      fetchNews: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await newsApi.getNews();

          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch news');
          }

          console.log('response.data: ', response.data);

          set({ news: response.data, isLoading: false });
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

          set({ currentNews: response.data, isLoading: false });
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
            throw new Error(response?.message || 'Failed to create news');
          }

          const newNews = response.data;
          set((state) => {
            const newState = {
              ...state,
              news: Array.isArray(state.news)
                ? [...state.news, newNews]
                : [newNews],
              isLoading: false
            };
            newState.revalidate();
            return newState;
          });
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
              news: state.news.map((item) =>
                item.id === id ? response.data : item
              ),
              currentNews: response.data,
              isLoading: false
            }));
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage, isLoading: false });
        }
      },

      editNews: async (id: string, data: UpdateNewsDto) => {
        console.log('data in news store nowwwwwwwwwwwwwww: ', data);

        try {
          set({ isLoading: true, error: null });

          // Ensure published is a boolean
          if (data.published !== undefined) {
            const publishedValue =
              typeof data.published === 'string'
                ? data.published === 'true'
                : Boolean(data.published);
            data.published = publishedValue;
          }

          const response = await newsApi.editNews(id, data);

          if (response.success) {
            set((state) => ({
              news: state.news.map((item) =>
                item.id === id ? response.data : item
              ),
              currentNews: response.data,
              isLoading: false
            }));
            set((state) => {
              const newState = { ...state, isLoading: false };
              newState.revalidate();
              return newState;
            });
          }

          return response;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error; // Re-throw to handle in the component
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
            set((state) => {
              const newState = { ...state, isLoading: false };
              newState.revalidate();
              return newState;
            });
          }

          return response.success;
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      revalidate: () => {
        set((state) => ({ ...state }));
      }
    }),
    {
      name: 'news-storage',
      partialize: (state) => ({
        news: state.news,
        currentNews: state.currentNews
      })
    }
  )
);
