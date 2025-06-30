import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mentorshipApi } from '../api/mentorship-api';
import {
  InterestsResponse,
  MentorResponse,
  MenteeResponse,
  PendingApplicationResponse
} from '../types';

interface MentorshipState {
  mentors: MentorResponse[];
  mentees: MenteeResponse[];
  interests: InterestsResponse[];
  isLoading: boolean;
  error: string | null;
  mentor: MentorResponse | null;
  pendingApplications: PendingApplicationResponse | null;

  // Actions
  createMentor: (mentorData: FormData) => Promise<MentorResponse>;
  createMentee: (menteeData: FormData) => Promise<MenteeResponse>;
  fetchInterests: () => Promise<InterestsResponse[]>;
  getMentor: (mentorId: number) => Promise<MentorResponse>;
  getPendingApplications: () => Promise<PendingApplicationResponse>;
}

export const useMentorshipStore = create<MentorshipState>()(
  devtools(
    (set) => ({
      mentors: [],
      interests: [],
      isLoading: false,
      error: null,
      mentor: null,

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

      fetchInterests: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await mentorshipApi.getInterests();

          const data = response.data;

          console.log('data in store:', data);

          set({ interests: data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'mentorship-store'
    }
  )
);
