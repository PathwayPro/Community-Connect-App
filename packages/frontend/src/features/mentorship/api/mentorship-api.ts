import { apiMethods } from '@/shared/api';
import { CreateMentorDto, InterestsResponse, MentorResponse } from '../types';

export const mentorshipApi = {
  getInterests: () => apiMethods.get<InterestsResponse[]>('/interests'),

  createMentor: (data: FormData) =>
    apiMethods.post<MentorResponse>('/mentors', data),

  getMentor: (mentorId: number) =>
    apiMethods.get<MentorResponse>(`/mentors/${mentorId}`)
};
