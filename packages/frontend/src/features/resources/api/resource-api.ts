import { apiMethods } from '@/shared/api';
import { Resource } from '../types';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource-dto';

export const resourceApi = {
  createResource: (data: CreateResourceDto) =>
    apiMethods.post<Resource>('/resources', data),

  getResources: () => apiMethods.get<Resource[]>('/resources'),

  getResourceById: (id: string) => apiMethods.get<Resource>(`/resources/${id}`),

  updateResource: (id: string, data: UpdateResourceDto) =>
    apiMethods.patch<Resource>(`/resources/${id}`, data),

  editResource: (id: string, data: UpdateResourceDto) =>
    apiMethods.put<Resource>(`/resources/${id}`, data),

  deleteResource: (id: string) =>
    apiMethods.delete<Resource>(`/resources/${id}`)
};
