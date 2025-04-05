import { apiMethods } from '@/shared/api';
import { Resource } from '../types';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource-dto';
import { ResourceResponse } from '../types';

export const resourceApi = {
  createResource: (data: CreateResourceDto) =>
    apiMethods.post<ResourceResponse<Resource>>('/resources', data),

  getResources: () => apiMethods.get<ResourceResponse<Resource>>('/resources'),

  getResourceById: (id: number) =>
    apiMethods.get<ResourceResponse<Resource>>(`/resources/${id}`),

  updateResource: (id: number, data: UpdateResourceDto) =>
    apiMethods.patch<ResourceResponse<Resource>>(`/resources/${id}`, data),

  editResource: (id: number, data: UpdateResourceDto) =>
    apiMethods.put<ResourceResponse<Resource>>(`/resources/${id}`, data),

  deleteResource: (id: number) =>
    apiMethods.delete<ResourceResponse<Resource>>(`/resources/${id}`)
};
