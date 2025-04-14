import { ApiResponse } from '@/shared/types';
import {
  CreateOpportunityDto,
  OpportunityResponseDto,
  SalaryRangeResponseDto,
  UpdateOpportunityDto
} from '../dto/opportunity-dto';
import { apiMethods } from '@/shared/api';

export const opportunityApi = {
  createOpportunity: (data: CreateOpportunityDto) =>
    apiMethods.post<OpportunityResponseDto>('/opportunities', data),

  getOpportunities: () =>
    apiMethods.get<OpportunityResponseDto[]>('/opportunities'),

  getOpportunityById: (id: number) =>
    apiMethods.get<OpportunityResponseDto>(`/opportunities/${id}`),

  updateOpportunity: (id: number, data: UpdateOpportunityDto) =>
    apiMethods.put<OpportunityResponseDto>(`/opportunities/${id}`, data),

  editOpportunity: (id: number, data: UpdateOpportunityDto) =>
    apiMethods.patch<OpportunityResponseDto>(`/opportunities/${id}`, data),

  deleteOpportunity: (id: number) =>
    apiMethods.delete<OpportunityResponseDto>(`/opportunities/${id}`),

  getSalaryRanges: () =>
    apiMethods.get<ApiResponse<SalaryRangeResponseDto[]>>('/salary-ranges')
};
