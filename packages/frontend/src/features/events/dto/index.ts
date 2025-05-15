import { EventSubscriptionStatus, EventType } from '../types';

// CreateEventDto
export interface CreateEventDto {
  title: string;
  // subtitle?: string;
  description: string;
  category_id: number;
  location?: string;
  link?: string;
  file?: File | null;
  is_free?: boolean;
  type?: EventType;
  requires_confirmation?: boolean;
  accept_subscriptions?: boolean;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

// UpdateEventDto
export interface UpdateEventDto {
  id: number;
  title?: string;
  // subtitle?: string;
  description?: string;
  category_id?: number;
  location?: string;
  link?: string;
  file?: File | null;
  is_free?: boolean;
  type?: EventType | null;
  requires_confirmation?: boolean | null;
  accept_subscriptions?: boolean | null;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface UpdateEventSubscriptionDto {
  new_status: EventSubscriptionStatus;
  message?: string;
}

export interface FilterEventsSubscriptionDto {
  event_id?: number;
  user_id?: number;
  status?: EventSubscriptionStatus;
  date_from?: Date;
  date_to?: Date;
}

// FormData Types
export type EventFormData = FormData;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
