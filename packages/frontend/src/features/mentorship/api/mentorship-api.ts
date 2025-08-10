import { apiMethods } from '@/shared/api';
import {
  InterestsResponse,
  MentorResponse,
  MenteeResponse,
  PendingApplicationResponse,
  AdminMentorshipDashboardTotals,
  MentorshipAdmin,
  Mentee,
  MyMentorDashboard,
  MentorStatistics,
  MentorUpcomingSessions,
  MyMentees,
  MenteeDashboard,
  MenteeNote,
  PastMentor,
  MenteeUpcomingSession,
  CreateMentorshipSessionDto,
  MentorshipSession
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
    apiMethods.put<MenteeResponse>(`/mentees/${menteeId}`, { status }),

  // New mentor dashboard endpoints
  getMyDashboard: () =>
    apiMethods.get<MyMentorDashboard>('/mentors/my-dashboard'),

  getMyStatistics: () =>
    apiMethods.get<MentorStatistics>('/mentors/my-statistics'),

  getMyUpcomingSessions: () =>
    apiMethods.get<MentorUpcomingSessions[]>('/mentors/my-upcoming-sessions'),

  getMyMentees: () => apiMethods.get<MyMentees[]>('/mentors/my-mentees'),

  // Create mentorship session (mentor only)
  createMentorshipSession: (body: CreateMentorshipSessionDto) =>
    apiMethods.post<MentorshipSession>(
      '/mentorship-sessions/mentorship-session',
      body
    ),

  // Update matching status (mentor only)
  updateMatchingStatus: (matchingId: number, status: string) =>
    apiMethods.patch(`/mentorship-sessions/matching/${matchingId}`, { status }),

  // Mentee dashboard endpoints
  getMenteeDashboard: () =>
    apiMethods.get<MenteeDashboard>('/mentees/my-dashboard'),

  getMenteeNotes: () => apiMethods.get<MenteeNote[]>('/mentees/my-notes'),

  getMenteePastMentors: () =>
    apiMethods.get<PastMentor[]>('/mentees/my-past-mentors'),

  getMenteeUpcomingSession: () =>
    apiMethods.get<MenteeUpcomingSession | null>('/mentees/my-upcoming-session')
};
