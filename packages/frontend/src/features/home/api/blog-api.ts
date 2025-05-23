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
    let url_params = '?';
    url_params += params?.filter ? 'filter=' + params.filter : '';
    url_params += params?.order_by ? 'order=' + params.order_by : '';
    url_params = url_params === '?' ? '' : url_params;

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
    apiMethods.post<SaveThreadResponse>(`/blog/post/${post_id}/save`)
};
