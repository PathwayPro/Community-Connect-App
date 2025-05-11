import { apiMethods } from '@/shared/api';
import { PostCommentResponse, ThreadResponse } from '../types';

export const blogApi = {
  getThreads: () => apiMethods.get<ThreadResponse[]>('/blog/post'),

  getThreadComments: (post_id: number) =>
    apiMethods.get<PostCommentResponse[]>(`/blog/post/${post_id}/comments`),

  createThread: (data: { message: string }) =>
    apiMethods.post<ThreadResponse>('/blog/post', data)

  // createMentee: (data: FormData) =>
  //   apiMethods.post<MenteeResponse>('/mentees', data),

  // getMentor: (mentorId: number) =>
  //   apiMethods.get<MentorResponse>(`/mentors/${mentorId}`)
};
