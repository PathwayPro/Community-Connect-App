import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  OpportunityResponseDto,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  SalaryRangeResponseDto
} from '../dto/opportunity-dto';
import { opportunityApi } from '../api/opportunity-api';
import { useRouter } from 'next/navigation';

interface OpportunityState {
  opportunities: OpportunityResponseDto[];
  selectedOpportunity: OpportunityResponseDto | null;
  isLoading: boolean;
  error: string | null;
  salaryRanges: SalaryRangeResponseDto[];
  router?: ReturnType<typeof useRouter>;

  // Actions
  fetchOpportunities: () => Promise<void>;
  fetchOpportunityById: (id: number) => Promise<void>;
  createOpportunity: (
    data: CreateOpportunityDto
  ) => Promise<OpportunityResponseDto | null>;
  updateOpportunity: (id: number, data: UpdateOpportunityDto) => Promise<void>;
  editOpportunity: (id: number, data: UpdateOpportunityDto) => Promise<void>;
  deleteOpportunity: (id: number) => Promise<void>;
  resetError: () => void;
  fetchSalaryRanges: () => Promise<void>;
}

export const useOpportunityStore = create<OpportunityState>()(
  devtools(
    persist(
      (set, get) => ({
        opportunities: [],
        selectedOpportunity: null,
        isLoading: false,
        error: null,
        salaryRanges: [],
        router: undefined,

        fetchOpportunities: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await opportunityApi.getOpportunities();
            set({ opportunities: response.data });
          } catch (error) {
            set({ error: (error as Error).message });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchOpportunityById: async (id: number) => {
          try {
            set({ isLoading: true, error: null });
            const response = await opportunityApi.getOpportunityById(id);
            set({ selectedOpportunity: response.data });
          } catch (error) {
            set({ error: (error as Error).message });
          } finally {
            set({ isLoading: false });
          }
        },

        createOpportunity: async (data: CreateOpportunityDto) => {
          try {
            set({ isLoading: true, error: null });
            const response = await opportunityApi.createOpportunity(data);
            set((state) => ({
              opportunities: [...state.opportunities, response.data]
            }));
            return response.data;
          } catch (error) {
            const errorMessage = (error as Error).message;
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateOpportunity: async (id: number, data: UpdateOpportunityDto) => {
          const { router } = get();
          try {
            set({ isLoading: true, error: null });
            const response = await opportunityApi.updateOpportunity(id, data);
            set((state) => ({
              opportunities: state.opportunities.map((opp) =>
                Number(opp.id) === id ? response.data : opp
              ),
              selectedOpportunity: response.data
            }));

            if (router) {
              router.push('/resources');
            }
          } catch (error) {
            const errorMessage = (error as Error).message;
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        editOpportunity: async (id: number, data: UpdateOpportunityDto) => {
          try {
            set({ isLoading: true, error: null });
            const response = await opportunityApi.editOpportunity(id, data);
            set((state) => ({
              opportunities: state.opportunities.map((opp) =>
                Number(opp.id) === id ? response.data : opp
              ),
              selectedOpportunity: response.data
            }));
          } catch (error) {
            set({ error: (error as Error).message });
          } finally {
            set({ isLoading: false });
          }
        },

        deleteOpportunity: async (id: number) => {
          const { router } = get();
          try {
            set({ isLoading: true, error: null });
            await opportunityApi.deleteOpportunity(id);
            set((state) => ({
              opportunities: state.opportunities.filter(
                (opp) => Number(opp.id) !== id
              ),
              selectedOpportunity:
                Number(state.selectedOpportunity?.id) === id
                  ? null
                  : state.selectedOpportunity
            }));

            if (router) {
              router.push('/resources');
            }
          } catch (error) {
            const errorMessage = (error as Error).message;
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        resetError: () => set({ error: null }),

        fetchSalaryRanges: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await opportunityApi.getSalaryRanges();

            set({
              salaryRanges: response.data as unknown as SalaryRangeResponseDto[]
            });
          } catch (error) {
            set({ error: (error as Error).message });
          } finally {
            set({ isLoading: false });
          }
        }
      }),
      {
        name: 'opportunity-storage',
        partialize: (state) => ({
          opportunities: state.opportunities,
          selectedOpportunity: state.selectedOpportunity,
          salaryRanges: state.salaryRanges
        })
      }
    )
  )
);
