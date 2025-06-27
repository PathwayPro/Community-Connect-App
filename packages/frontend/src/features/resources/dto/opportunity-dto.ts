import { WorkSettings } from '../lib/constants/enums';

export interface OpportunityDto {
  job: string;
  salary_range_id: number;
  company: string;
  province: string;
  city: string;
  settings: WorkSettings;
  link_apply: string;
  link_post: string;
  description: string;
  experience: string;
  salary_range: {
    from: number;
    to: number;
  };
  image?: string;
}

export interface CreateOpportunityDto extends Omit<OpportunityDto, 'image'> {
  image?: string;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {
  image?: string;
}

export interface OpportunityResponseDto extends OpportunityDto {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface FilterOpportunityDto {
  job?: string;
  salary_range_id?: number;
  company?: string;
  province?: string;
  city?: string;
  settings?: WorkSettings;
  salary_range?: {
    from: number;
    to: number;
  };
  description?: string;
  date_from?: string; // ISO 8601 date string
  date_to?: string; // ISO 8601 date string
  experience?: string;
}

export interface SalaryRangeResponseDto {
  id: string;
  from: number;
  to: number;
}
