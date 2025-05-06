import { apiMethods } from '@/shared/api';
import { Event, EventCategory, EventResponse } from '../types';
import { CreateEventDto, UpdateEventDto, EventFormData } from '../dto';

export const eventApi = {
  createEvent: (formData: EventFormData) =>
    apiMethods.post<EventResponse<Event>>('/events', formData, {
      'Content-Type': 'multipart/form-data'
    }),

  getEvents: () => apiMethods.get<EventResponse<Event>>('/events'),

  getEventCategories: () =>
    apiMethods.get<EventResponse<EventCategory>>('/events-categories'),

  getEventById: (id: number) =>
    apiMethods.get<EventResponse<Event>>(`/events/${id}`),

  updateEvent: (id: number, formData: EventFormData) =>
    apiMethods.patch<EventResponse<Event>>(`/events/${id}`, formData, {
      'Content-Type': 'multipart/form-data'
    }),

  editEvent: (id: number, data: UpdateEventDto) =>
    apiMethods.put<EventResponse<Event>>(`/events/${id}`, data),

  deleteEvent: (id: number) =>
    apiMethods.delete<EventResponse<Event>>(`/events/${id}`)
};
