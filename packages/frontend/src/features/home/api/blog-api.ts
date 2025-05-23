import { apiMethods } from '@/shared/api';
import {
  PostCommentResponse,
  ThreadResponse,
  LikeThreadResponse
} from '../types';

export const blogApi = {
  getThreads: () => apiMethods.get<ThreadResponse[]>('/blog/post'),

  getThreadComments: (post_id: number) =>
    apiMethods.get<PostCommentResponse[]>(`/blog/post/${post_id}/comments`),

  createThread: (data: { message: string }) =>
    apiMethods.post<ThreadResponse>('/blog/post', data),

  createComment: (data: { post_id: number; message: string }) =>
    apiMethods.post<ThreadResponse>('/blog/comment', data),

  toggleLike: async (post_id: number) =>
    apiMethods.post<LikeThreadResponse>(`/blog/post/${post_id}/like`)

  // createMentee: (data: FormData) =>
  //   apiMethods.post<MenteeResponse>('/mentees', data),

  // getMentor: (mentorId: number) =>
  //   apiMethods.get<MentorResponse>(`/mentors/${mentorId}`)
};
