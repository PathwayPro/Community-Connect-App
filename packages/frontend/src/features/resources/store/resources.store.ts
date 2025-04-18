import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resource } from '../types';
import { resourceApi } from '../api/resource-api';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource-dto';
import { useRouter } from 'next/navigation';

interface ResourcesState {
  resources: Resource[];
  isLoading: boolean;
  error: string | null;
  router?: ReturnType<typeof useRouter>;

  // Actions
  fetchResources: () => Promise<void>;
  createResource: (data: CreateResourceDto) => Promise<Resource | undefined>;
  updateResource: (id: string, data: UpdateResourceDto) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  getResourceById: (id: string) => Promise<Resource | undefined>;
}

export const useResourcesStore = create<ResourcesState>()(
  persist(
    (set, get) => ({
      resources: [],
      isLoading: false,
      error: null,
      router: undefined,

      fetchResources: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await resourceApi.getResources();
          set({ resources: response.data, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      createResource: async (data: CreateResourceDto) => {
        const { router } = get();
        try {
          set({ isLoading: true, error: null });
          const response = await resourceApi.createResource(data);
          set((state) => ({
            resources: [...state.resources, response.data],
            isLoading: false
          }));

          if (router) {
            router.push('/resources');
          }

          return response.data;
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateResource: async (id: string, data: UpdateResourceDto) => {
        const { router } = get();
        try {
          set({ isLoading: true, error: null });
          const response = await resourceApi.updateResource(id, data);
          set((state) => ({
            resources: state.resources.map((resource) =>
              resource.id === id ? response.data : resource
            ),
            isLoading: false
          }));

          if (router) {
            router.push('/resources');
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      deleteResource: async (id: string) => {
        const { router } = get();
        try {
          set({ isLoading: true, error: null });
          await resourceApi.deleteResource(id);
          set((state) => ({
            resources: state.resources.filter((resource) => resource.id !== id),
            isLoading: false
          }));

          if (router) {
            router.push('/resources');
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      getResourceById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await resourceApi.getResourceById(id);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          return undefined;
        }
      }
    }),
    {
      name: 'resources-storage',
      partialize: (state) => ({
        resources: state.resources
      })
    }
  )
);
