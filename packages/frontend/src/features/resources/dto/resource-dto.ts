import { resourceTypes } from '../lib/constants/enums';

export interface CreateResourceDto {
  title: string;
  details: string;
  type: typeof resourceTypes;
  link: string;
  file?: File;
}

export interface FilterResourceDto {
  title?: string;
  details?: string;
  type?: typeof resourceTypes;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  file?: string;
}

export interface UpdateResourceDto {
  title?: string;
  details?: string;
  type?: typeof resourceTypes;
  link?: string;
  file?: File;
}

export interface ResourceDto extends Omit<CreateResourceDto, 'file'> {
  id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  details: string;
  file?: string;
  user: {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    role: string;
  };
}
