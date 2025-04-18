import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { blogApi } from '../api/blog-api';
import { ThreadResponse, PostCommentResponse } from '../types';

interface BlogState {
  threads: ThreadResponse[];
  threadMessages: PostCommentResponse[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchThreads: () => Promise<void>;
  fetchThreadComments: (post_id: number) => Promise<void>;
}

export const useBlogStore = create<BlogState>()(
  devtools(
    (set) => ({
      threads: [],
      isLoading: false,
      error: null,

      fetchThreads: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.getThreads();
          const data = response.data;
          console.log('| - - - - - - - > DATA FROM BLOG STORE:', data);
          set({ threads: data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      fetchThreadComments: async (post_id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.getThreadComments(post_id);
          const data = response.data;
          console.log(
            '| - - - - - - - > DATA FROM BLOG STORE - MESSAGES:',
            data
          );
          set({ threadMessages: data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'blog-store'
    }
  )
);
