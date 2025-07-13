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
    apiMethods.get<MentorResponse>(`/mentors/application-id/${mentorId}`),

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

  updateMentorStatus: (mentorId: number, status: string) =>
    apiMethods.put<MentorResponse>(`/mentors/application-id/${mentorId}`, {
      status
    }),

  // Add mentee status update method
  updateMenteeStatus: (menteeId: number, status: string) =>
    apiMethods.put<MenteeResponse>(`/mentees/${menteeId}`, { status })
};
