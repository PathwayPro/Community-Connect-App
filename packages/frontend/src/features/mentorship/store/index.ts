import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mentorshipApi } from '../api/mentorship-api';
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

interface MentorshipState {
  mentors: MentorResponse[];
  mentees: MenteeResponse[];
  interests: InterestsResponse[];
  isLoading: boolean;
  error: string | null;
  mentor: MentorResponse | null;
  pendingApplications: PendingApplicationResponse | null;
  adminMentorshipTotals: AdminMentorshipDashboardTotals;
  adminMentorApplications: MentorshipAdmin[];
  adminMenteeApplications: Mentee[];
  // New mentor dashboard state
  mentorDashboard: MyMentorDashboard | null;
  mentorStatistics: MentorStatistics | null;
  mentorUpcomingSessions: MentorUpcomingSessions[];
  mentorMentees: MyMentees[];
  // Mentee dashboard state
  menteeDashboard: MenteeDashboard | null;
  menteeNotes: MenteeNote[];
  pastMentors: PastMentor[];
  menteeUpcomingSession: MenteeUpcomingSession | null;
  // Actions
  createMentor: (mentorData: FormData) => Promise<MentorResponse>;
  createMentee: (menteeData: FormData) => Promise<MenteeResponse>;
  createMentorshipSession: (
    payload: CreateMentorshipSessionDto
  ) => Promise<MentorshipSession>;
  fetchInterests: () => Promise<InterestsResponse[]>;
  getMentor: (mentorId: number) => Promise<MentorResponse>;
  getPendingApplications: () => Promise<PendingApplicationResponse>;
  getAdminMentorshipTotals: () => Promise<AdminMentorshipDashboardTotals>;
  getAdminMentorApplications: () => Promise<MentorshipAdmin[]>;
  getAdminMenteeApplications: () => Promise<Mentee[]>;
  // New mentor dashboard actions
  getMyDashboard: () => Promise<MyMentorDashboard>;
  getMyStatistics: () => Promise<MentorStatistics>;
  getMyUpcomingSessions: () => Promise<MentorUpcomingSessions[]>;
  getMyMentees: () => Promise<MyMentees[]>;
  // Mentee dashboard actions
  getMenteeDashboard: () => Promise<MenteeDashboard>;
  getMenteeNotes: () => Promise<MenteeNote[]>;
  getMenteePastMentors: () => Promise<PastMentor[]>;
  getMenteeUpcomingSession: () => Promise<MenteeUpcomingSession | null>;
}

export const useMentorshipStore = create<MentorshipState>()(
  devtools(
    (set) => ({
      mentors: [],
      interests: [],
      isLoading: false,
      error: null,
      mentor: null,
      mentorDashboard: null,
      mentorStatistics: null,
      mentorUpcomingSessions: [],
      mentorMentees: [],
      // Mentee
      menteeDashboard: null,
      menteeNotes: [],
      pastMentors: [],
      menteeUpcomingSession: null,

      createMentor: async (mentorData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.createMentor(mentorData);
          set((state) => ({
            mentors: [...state.mentors, response.data],
            isLoading: false
          }));
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      createMentee: async (menteeData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.createMentee(menteeData);
          set((state) => ({
            mentees: [...state.mentees, response.data],
            isLoading: false
          }));
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      createMentorshipSession: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.createMentorshipSession(payload);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      getMentor: async (mentorId: number) => {
        const response = await mentorshipApi.getMentor(mentorId);
        set({ mentor: response.data });
        return response;
      },

      getPendingApplications: async () => {
        const response = await mentorshipApi.getPendingApplications();
        set({ pendingApplications: response.data });
        return response;
      },

      getAdminMentorshipTotals: async () => {
        const response = await mentorshipApi.getAdminMentorshipTotals();
        set({ adminMentorshipTotals: response.data });
        return response;
      },

      getAdminMentorApplications: async () => {
        const response = await mentorshipApi.getAdminMentorApplications();
        set({ adminMentorApplications: response.data });
        return response;
      },

      getAdminMenteeApplications: async () => {
        const response = await mentorshipApi.getAdminMenteeApplications();
        set({ adminMenteeApplications: response.data });
        return response;
      },

      // New mentor dashboard actions
      getMyDashboard: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMyDashboard();
          set({
            mentorDashboard: response.data,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      getMyStatistics: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMyStatistics();
          set({
            mentorStatistics: response.data,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      getMyUpcomingSessions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMyUpcomingSessions();
          set({
            mentorUpcomingSessions: response.data,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      getMyMentees: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMyMentees();
          set({
            mentorMentees: response.data,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      // Mentee dashboard actions
      getMenteeDashboard: async () => {
        console.log('MENTEE DASHBOARD GET');
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMenteeDashboard();
          console.log('MENTEE DASHBOARD', response.data);
          set({ menteeDashboard: response.data, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      getMenteeNotes: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMenteeNotes();
          set({ menteeNotes: response.data, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      getMenteePastMentors: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMenteePastMentors();
          set({ pastMentors: response.data, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      getMenteeUpcomingSession: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getMenteeUpcomingSession();
          set({ menteeUpcomingSession: response.data, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      },

      fetchInterests: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getInterests();
          set({ interests: response.data, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          throw error;
        }
      }
    }),
    {
      name: 'mentorship-store'
    }
  )
);
