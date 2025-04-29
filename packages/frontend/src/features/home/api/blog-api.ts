import { apiMethods } from '@/shared/api';
import { PostCommentResponse, ThreadResponse } from '../types';

export const blogApi = {
  getThreads: () => apiMethods.get<ThreadResponse[]>('/blog/post'),
  getThreadComments: (post_id: number) =>
    apiMethods.get<PostCommentResponse[]>(`/blog/post/${post_id}/comments`)

  // createMentor: (data: FormData) =>
  //   apiMethods.post<MentorResponse>('/mentors', data),

  // createMentee: (data: FormData) =>
  //   apiMethods.post<MenteeResponse>('/mentees', data),

  // getMentor: (mentorId: number) =>
  //   apiMethods.get<MentorResponse>(`/mentors/${mentorId}`)
};
