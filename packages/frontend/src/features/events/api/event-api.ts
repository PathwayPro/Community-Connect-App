import { apiMethods } from '@/shared/api';
import { EventCategory, EventResponse } from '../types';
import { CreateEventDto, UpdateEventDto } from '../dto';

export const eventApi = {
  createEvent: (data: CreateEventDto) =>
    apiMethods.post<EventResponse<Event>>('/events', data),

  getEvents: () => apiMethods.get<EventResponse<Event>>('/events'),

  getEventCategories: () =>
    apiMethods.get<EventResponse<EventCategory>>('/events-categories'),

  getEventById: (id: number) =>
    apiMethods.get<EventResponse<Event>>(`/events/${id}`),

  updateEvent: (id: number, data: UpdateEventDto) =>
    apiMethods.patch<EventResponse<Event>>(`/events/${id}`, data),

  editEvent: (id: number, data: UpdateEventDto) =>
    apiMethods.put<EventResponse<Event>>(`/events/${id}`, data),

  deleteEvent: (id: number) =>
    apiMethods.delete<EventResponse<Event>>(`/events/${id}`)
};
