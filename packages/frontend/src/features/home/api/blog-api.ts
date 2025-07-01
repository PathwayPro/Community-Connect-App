import { apiMethods } from '@/shared/api';
import {
  PostCommentResponse,
  ThreadResponse,
  LikeThreadResponse,
  SaveThreadResponse,
  ThreadsParams
} from '../types';

export const blogApi = {
  getThreads: (params?: ThreadsParams) => {
    let url_params = '?filter=';
    url_params += params?.filter ? params.filter : 'THREADS';
    url_params += '&order_by=';
    url_params += params?.order_by ? params.order_by : 'newest';

    return apiMethods.get<ThreadResponse[]>(`/blog/post${url_params}`);
  },

  getThreadComments: (post_id: number) =>
    apiMethods.get<PostCommentResponse[]>(`/blog/post/${post_id}/comments`),

  createThread: (data: { message: string }) =>
    apiMethods.post<ThreadResponse>('/blog/post', data),

  createComment: (data: { post_id: number; message: string }) =>
    apiMethods.post<ThreadResponse>('/blog/comment', data),

  toggleLike: async (post_id: number) =>
    apiMethods.post<LikeThreadResponse>(`/blog/post/${post_id}/like`),

  toggleSave: async (post_id: number) =>
    apiMethods.post<SaveThreadResponse>(`/blog/post/${post_id}/save`),

  updateThread: async (post_id: number, content: string) =>
    apiMethods.put<ThreadResponse>(`/blog/post/${post_id}`, {
      message: content
    }),

  deleteThread: async (post_id: number) =>
    apiMethods.delete<ThreadResponse>(`/blog/post/${post_id}`),

  deleteComment: async (comment_id: number) =>
    apiMethods.delete(`/blog/comment/${comment_id}`)
};
