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
  updateThread: (
    post_id: number,
    content: string
  ) => Promise<string | undefined>;

  // Comment actions
  toggleCommentLike: (comment_id: number) => Promise<LikeThreadResponse>;
  toggleCommentSave: (comment_id: number) => Promise<SaveThreadResponse>;
  createSubComment: (comment_id: number, content: string) => Promise<void>;
  fetchSubComments: (comment_id: number) => Promise<void>;
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

          // get user profile picture

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

      updateThread: async (post_id: number, content: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('UPDATING THREAD: ', post_id, content);

          const response = await blogApi.updateThread(post_id, content);

          console.log('| - - - - - - - > RESPONSE UPDATING THREAD:', response);

          return response.data.content;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
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
      },

      // Comment actions
      toggleCommentLike: async (comment_id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.toggleCommentLike(comment_id);

          return response.data.likeStatus === 'CREATED';
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      toggleCommentSave: async (comment_id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.toggleCommentSave(comment_id);

          return response.data.saveStatus === 'CREATED';
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      createSubComment: async (comment_id: number, content: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('CREANDO SUBCOMMENT: ', comment_id, content);
          const data = { comment_id: comment_id, message: content };
          const response = await blogApi.createSubComment(data);

          console.log(
            '| - - - - - - - > RESPONSE CREANDO SUBCOMMENT:',
            response
          );

          const message = response.data.message;

          //set({ threadMessages: data, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'An error occurred creating the subcomment',
            isLoading: false
          });
        }
      },

      fetchSubComments: async (comment_id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await blogApi.getSubComments(comment_id);
          const data = response.data;

          console.log(
            '| - - - - - - - > DATA FROM BLOG STORE - SUBCOMMENTS:',
            data
          );

          // get user profile picture

          set({ threadMessages: data, isLoading: false });
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
