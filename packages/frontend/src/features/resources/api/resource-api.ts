import { apiMethods } from '@/shared/api';
import { ResourceDto } from '../dto/resource-dto';

export const resourceApi = {
  createResource: (data: FormData) =>
    apiMethods.post<ResourceDto>('/resources', data),

  getResources: () => apiMethods.get<ResourceDto[]>('/resources'),

  getResourceById: (id: string) =>
    apiMethods.get<ResourceDto>(`/resources/${id}`),

  updateResource: (id: string, data: FormData) =>
    apiMethods.patch<ResourceDto>(`/resources/${id}`, data),

  deleteResource: (id: string) =>
    apiMethods.delete<ResourceDto>(`/resources/${id}`)
};
