import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { blogApi } from '../api/blog-api';
import {
  ThreadResponse,
  PostCommentResponse,
  LikeThreadResponse,
  SaveThreadResponse,
  ThreadsParams
} from '../types';

interface BlogState {
  threads: ThreadResponse[];
  threadMessages: PostCommentResponse[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchThreads: (params?: ThreadsParams) => Promise<void>;
  fetchThreadComments: (post_id: number) => Promise<void>;
  createThread: (content: string) => Promise<boolean>;
  createComment: (post_id: number, content: string) => Promise<void>;
  toggleLike: (post_id: number) => Promise<LikeThreadResponse>;
  toggleSave: (post_id: number) => Promise<SaveThreadResponse>;
}

export const useBlogStore = create<BlogState>()(
  devtools(
    (set) => ({
      threads: [],
      isLoading: false,
      error: null,

      fetchThreads: async (params?: ThreadsParams) => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.getThreads(params);
          const data = response.data;

          // console.log('| - - - - - - - > DATA FROM BLOG STORE:', data, params);

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
      },

      createThread: async (content: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('CREANDO THREAD: ', content);
          const data = { message: content };
          const response = await blogApi.createThread(data);

          console.log('| - - - - - - - > RESPONSE CREANDO THREAD:', response);

          return response.success;

          //set({ threadMessages: message, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'An error occurred creating the thread',
            isLoading: false
          });
        }
      },

      createComment: async (post_id: number, content: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('CREANDO COMMENT: ', post_id, content);
          const data = { post_id: post_id, message: content };
          const response = await blogApi.createComment(data);

          console.log('| - - - - - - - > RESPONSE CREANDO COMMENT:', response);

          const message = response.data.content;

          //set({ threadMessages: data, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'An error occurred creating the comment',
            isLoading: false
          });
        }
      },

      toggleLike: async (post_id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.toggleLike(post_id);

          return response.data.likeStatus === 'CREATED';
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      toggleSave: async (post_id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.toggleSave(post_id);

          return response.data.saveStatus === 'CREATED';
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      }
    }),
    { name: 'blog-store' }
  )
);
