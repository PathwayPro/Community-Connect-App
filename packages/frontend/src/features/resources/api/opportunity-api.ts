import { ApiResponse } from '@/shared/types';
import {
  CreateOpportunityDto,
  OpportunityResponseDto,
  UpdateOpportunityDto
} from '../dto/opportunity-dto';
import { apiMethods } from '@/shared/api';

export const opportunityApi = {
  createOpportunity: (data: CreateOpportunityDto) =>
    apiMethods.post<ApiResponse<OpportunityResponseDto>>(
      '/opportunities',
      data
    ),

  getOpportunities: () =>
    apiMethods.get<ApiResponse<OpportunityResponseDto[]>>('/opportunities'),

  getOpportunityById: (id: number) =>
    apiMethods.get<ApiResponse<OpportunityResponseDto>>(`/opportunities/${id}`),

  updateOpportunity: (id: number, data: UpdateOpportunityDto) =>
    apiMethods.put<ApiResponse<OpportunityResponseDto>>(
      `/opportunities/${id}`,
      data
    ),

  editOpportunity: (id: number, data: UpdateOpportunityDto) =>
    apiMethods.patch<ApiResponse<OpportunityResponseDto>>(
      `/opportunities/${id}`,
      data
    ),

  deleteOpportunity: (id: number) =>
    apiMethods.delete<ApiResponse<OpportunityResponseDto>>(
      `/opportunities/${id}`
    )
};
