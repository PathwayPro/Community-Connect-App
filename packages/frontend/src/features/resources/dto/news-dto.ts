import { NewsType } from '../lib/constants/enums';

export interface CreateNewsDto {
  title: string;
  details: string;
  type: NewsType;
  link: string;
  published?: boolean;
  file?: File;
}

export interface FilterNewsDto {
  title?: string;
  details?: string;
  published?: boolean;
  user_id?: number;
  date_from?: Date;
  date_to?: Date;
}

export interface UpdateNewsDto extends Partial<CreateNewsDto> {
  title?: string;
  details?: string;
  type?: NewsType;
  link?: string;
  published?: boolean;
  file?: File;
}

export interface NewsDto extends CreateNewsDto {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}
