import { WorkSettings } from '../lib/constants/enums';

export interface OpportunityDto {
  job: string;
  company: string;
  province: string;
  city: string;
  salary_range_id: number;
  settings: WorkSettings;
  link_apply: string;
  link_post: string;
  description: string;
  file?: File;
}

export interface CreateOpportunityDto extends Omit<OpportunityDto, 'file'> {
  file?: File | null;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {
  file?: File | null;
}

export interface OpportunityResponseDto extends OpportunityDto {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface FilterOpportunityDto {
  job?: string;
  company?: string;
  province?: string;
  city?: string;
  salary_range_id?: number;
  settings?: WorkSettings;
  description?: string;
  date_from?: string; // ISO 8601 date string
  date_to?: string; // ISO 8601 date string
}
