import { apiMethods } from '@/shared/api';
import { Resource } from '../types';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource-dto';
import { ApiResponse } from '@/shared/types';
export const resourceApi = {
  createResource: (data: CreateResourceDto) =>
    apiMethods.post<ApiResponse<Resource>>('/resources', data),

  getResources: () => apiMethods.get<ApiResponse<Resource[]>>('/resources'),

  getResourceById: (id: string) =>
    apiMethods.get<ApiResponse<Resource>>(`/resources/${id}`),

  updateResource: (id: string, data: UpdateResourceDto) =>
    apiMethods.patch<ApiResponse<Resource>>(`/resources/${id}`, data),

  editResource: (id: string, data: UpdateResourceDto) =>
    apiMethods.put<ApiResponse<Resource>>(`/resources/${id}`, data),

  deleteResource: (id: string) =>
    apiMethods.delete<ApiResponse<Resource>>(`/resources/${id}`)
};
