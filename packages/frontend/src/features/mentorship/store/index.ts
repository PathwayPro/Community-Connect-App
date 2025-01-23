import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mentorshipApi } from '../api/mentorship-api';
import { CreateMentorDto, InterestsResponse, MentorResponse } from '../types';

interface MentorshipState {
  mentors: MentorResponse[];
  interests: InterestsResponse[];
  isLoading: boolean;
  error: string | null;
  mentor: MentorResponse | null;

  // Actions
  createMentor: (mentorData: CreateMentorDto) => Promise<MentorResponse>;
  fetchInterests: () => Promise<InterestsResponse[]>;
  getMentor: (mentorId: number) => Promise<MentorResponse>;
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

      getMentor: async (mentorId: number) => {
        const response = await mentorshipApi.getMentor(mentorId);
        set({ mentor: response.data });
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
