import { EventType } from '../types';

// CreateEventDto
export interface CreateEventDto {
  title: string;
  subtitle?: string;
  description: string;
  category_id: number;
  location?: string;
  link?: string;
  image?: string;
  is_free?: boolean;
  type?: EventType;
  requires_confirmation?: boolean;
  accept_subscriptions?: boolean;
  start_date?: string;
  start_time?: string;
  end_time?: string;
}

// UpdateEventDto
export interface UpdateEventDto {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
  category_id?: number;
  location?: string;
  link?: string;
  image?: string;
  is_free?: boolean;
  type?: EventType | null;
  requires_confirmation?: boolean | null;
  accept_subscriptions?: boolean | null;
  start_date?: string;
  start_time?: string;
  end_time?: string;
}
