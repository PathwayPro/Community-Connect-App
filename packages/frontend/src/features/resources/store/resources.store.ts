import { create } from 'zustand';
import { Resource } from '../types';
import { resourceApi } from '../api/resource-api';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource-dto';

interface ResourcesState {
  resources: Resource[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchResources: () => Promise<void>;
  createResource: (data: CreateResourceDto) => Promise<void>;
  updateResource: (id: string, data: UpdateResourceDto) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  getResourceById: (id: string) => Promise<Resource | undefined>;
}

export const useResourcesStore = create<ResourcesState>((set) => ({
  resources: [],
  isLoading: false,
  error: null,

  fetchResources: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await resourceApi.getResources();
      set({ resources: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createResource: async (data: CreateResourceDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await resourceApi.createResource(data);
      set((state) => ({
        resources: [...state.resources, response.data.data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateResource: async (id: string, data: UpdateResourceDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await resourceApi.updateResource(id, data);
      set((state) => ({
        resources: state.resources.map((resource) =>
          resource.id === id ? response.data.data : resource
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteResource: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await resourceApi.deleteResource(id);
      set((state) => ({
        resources: state.resources.filter((resource) => resource.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getResourceById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await resourceApi.getResourceById(id);
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return undefined;
    }
  }
}));
