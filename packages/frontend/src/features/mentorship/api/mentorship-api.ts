import { apiMethods } from '@/shared/api';
import {
  InterestsResponse,
  MentorResponse,
  MenteeResponse,
  PendingApplicationResponse,
  AdminMentorshipDashboardTotals,
  MentorshipAdmin,
  Mentee
} from '../types';

export const mentorshipApi = {
  getInterests: () => apiMethods.get<InterestsResponse[]>('/interests'),

  createMentor: (data: FormData) =>
    apiMethods.post<MentorResponse>('/mentors', data),

  createMentee: (data: FormData) =>
    apiMethods.post<MenteeResponse>('/mentees', data),

  getMentor: (mentorId: number) =>
    apiMethods.get<MentorResponse>(`/mentors/${mentorId}`),

  getPendingApplications: () =>
    apiMethods.get<PendingApplicationResponse>(`/users/pending-applications`),

  getAdminMentorshipTotals: () =>
    apiMethods.get<AdminMentorshipDashboardTotals>(
      `/admin/mentorship/total-applications`
    ),

  getAdminMentorApplications: () =>
    apiMethods.get<MentorshipAdmin[]>(`/admin/mentorship/mentor-applications`),

  getAdminMenteeApplications: () =>
    apiMethods.get<Mentee[]>(`/admin/mentorship/mentee-applications`),

  // Add this new method
  updateMentorStatus: (mentorId: number, status: string) =>
    apiMethods.put<MentorResponse>(`/mentors/${mentorId}`, { status })
};
