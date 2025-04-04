import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  OpportunityResponseDto,
  CreateOpportunityDto,
  UpdateOpportunityDto
} from '../dto/opportunity-dto';
import { opportunityApi } from '../api/opportunity-api';

interface OpportunityState {
  opportunities: OpportunityResponseDto[];
  selectedOpportunity: OpportunityResponseDto | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOpportunities: () => Promise<void>;
  fetchOpportunityById: (id: number) => Promise<void>;
  createOpportunity: (data: CreateOpportunityDto) => Promise<void>;
  updateOpportunity: (id: number, data: UpdateOpportunityDto) => Promise<void>;
  editOpportunity: (id: number, data: UpdateOpportunityDto) => Promise<void>;
  deleteOpportunity: (id: number) => Promise<void>;
  resetError: () => void;
}

export const useOpportunityStore = create<OpportunityState>()(
  devtools((set) => ({
    opportunities: [],
    selectedOpportunity: null,
    isLoading: false,
    error: null,

    fetchOpportunities: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await opportunityApi.getOpportunities();
        set({ opportunities: response.data.data });
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
        set({ selectedOpportunity: response.data.data });
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
          opportunities: [...state.opportunities, response.data.data]
        }));
      } catch (error) {
        set({ error: (error as Error).message });
      } finally {
        set({ isLoading: false });
      }
    },

    updateOpportunity: async (id: number, data: UpdateOpportunityDto) => {
      try {
        set({ isLoading: true, error: null });
        const response = await opportunityApi.updateOpportunity(id, data);
        set((state) => ({
          opportunities: state.opportunities.map((opp) =>
            opp.id === id ? response.data.data : opp
          ),
          selectedOpportunity: response.data.data
        }));
      } catch (error) {
        set({ error: (error as Error).message });
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
            opp.id === id ? response.data.data : opp
          ),
          selectedOpportunity: response.data.data
        }));
      } catch (error) {
        set({ error: (error as Error).message });
      } finally {
        set({ isLoading: false });
      }
    },

    deleteOpportunity: async (id: number) => {
      try {
        set({ isLoading: true, error: null });
        await opportunityApi.deleteOpportunity(id);
        set((state) => ({
          opportunities: state.opportunities.filter((opp) => opp.id !== id),
          selectedOpportunity:
            state.selectedOpportunity?.id === id
              ? null
              : state.selectedOpportunity
        }));
      } catch (error) {
        set({ error: (error as Error).message });
      } finally {
        set({ isLoading: false });
      }
    },

    resetError: () => set({ error: null })
  }))
);
