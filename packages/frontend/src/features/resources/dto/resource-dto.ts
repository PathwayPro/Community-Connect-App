export interface CreateResourceDto {
  title: string;
  details: string;
  type: string;
  link?: string;
}

export interface FilterResourceDto {
  title?: string;
  link?: string;
  user_id?: number;
  date_from?: string;
  date_to?: string;
}

export interface UpdateResourceDto {
  title?: string;
  details?: string;
  type?: string;
  link?: string;
}

export interface ResourceDto extends CreateResourceDto {
  id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}
