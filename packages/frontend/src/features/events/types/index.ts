// Enums
export enum EventType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export enum EventDateStatus {
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  RESCHEDULED = 'RESCHEDULED',
  CANCELED = 'CANCELED'
}

export enum EventSubscriptionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Interfaces
export interface Event {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  location?: string;
  link?: string;
  image?: string;
  is_free: boolean;
  type: EventType;
  reqConfirm: boolean;
  createdAt: Date;
  updatedAt: Date;
  category_id: number;
  category: EventCategory;
  start_date: string;
  start_time: string;
  end_time: string;
  host_id: number;
  host_name: string;
  host_bio: string;
  host_image: string;
}

export interface EventWithHost extends Event {
  isHost: boolean;
}

export interface EventCategory {
  id: number;
  name: string;
}

export interface EventDate {
  id: number;
  eventId: number;
  start: Date;
  end: Date;
  status: EventDateStatus;
}

export interface EventDateUpdate {
  id: number;
  eventDateId: number;
  prevStatus: EventDateStatus;
  newStatus: EventDateStatus;
  message: string;
}

export interface EventSpeaker {
  id: number;
  eventId: number;
  name: string;
  description: string;
}

export interface EventManager {
  id: number;
  userId: number;
  eventId: number;
  isSpeaker: boolean;
}

export interface EventSubscription {
  id: number;
  userId: number;
  eventId: number;
  status: EventSubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventSubscriptionUpdate {
  id: number;
  subscriptionId: number;
  prevStatus: EventSubscriptionStatus;
  newStatus: EventSubscriptionStatus;
  message: string;
  createdAt: Date;
  updatedBy: number;
}

export interface EventInvitation {
  id: number;
  inviterId: number;
  inviteeId: number;
  eventId: number;
  message: string;
  createdAt: Date;
}

export interface EventResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
