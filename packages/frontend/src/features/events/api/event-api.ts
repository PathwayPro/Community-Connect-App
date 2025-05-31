import { apiMethods } from '@/shared/api';
import {
  Event,
  EventCategory,
  EventResponse,
  EventSubscription
} from '../types';
import {
  UpdateEventDto,
  EventFormData,
  UpdateEventSubscriptionDto,
  FilterEventsSubscriptionDto
} from '../dto';

export const eventApi = {
  createEvent: (formData: EventFormData) => {
    // Log FormData contents for debugging
    console.log('Sending FormData to API:');
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // Don't set Content-Type header - let browser set it with boundary
    return apiMethods.post<EventResponse<Event>>('/events', formData);
  },

  getEvents: () => apiMethods.get<EventResponse<Event>>('/events'),

  getEventCategories: () =>
    apiMethods.get<EventResponse<EventCategory>>('/events-categories'),

  getEventById: (id: number) =>
    apiMethods.get<EventResponse<Event>>(`/events/${id}`),

  updateEvent: (id: number, formData: EventFormData) => {
    // Log FormData contents for debugging
    console.log('Updating event with FormData:');
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // Don't set Content-Type header - let browser set it with boundary
    return apiMethods.patch<EventResponse<Event>>(`/events/${id}`, formData);
  },

  editEvent: (id: number, data: UpdateEventDto) =>
    apiMethods.put<EventResponse<Event>>(`/events/${id}`, data),

  deleteEvent: (id: number) =>
    apiMethods.delete<EventResponse<Event>>(`/events/${id}`),

  // Event Subscriptions
  createEventSubscription: (eventId: number) =>
    apiMethods.post<EventResponse<EventSubscription>>(`/events-subscriptions`, {
      event_id: eventId
    }),

  updateEventSubscription: (id: number, data: UpdateEventSubscriptionDto) =>
    apiMethods.put<EventResponse<EventSubscription>>(
      `/events-subscriptions/${id}`,
      data
    ),

  getEventSubscriptions: (filters: Partial<FilterEventsSubscriptionDto>) => {
    // Convert numeric string IDs to numbers if they exist
    const processedFilters: Record<string, string> = {
      ...(filters.event_id && { event_id: String(filters.event_id) }),
      ...(filters.user_id && { user_id: String(filters.user_id) }),
      ...(filters.status && { status: String(filters.status) }),
      ...(filters.date_from && { date_from: String(filters.date_from) }),
      ...(filters.date_to && { date_to: String(filters.date_to) })
    };

    return apiMethods.get<EventResponse<EventSubscription>>(
      `/events-subscriptions?${new URLSearchParams(processedFilters).toString()}`
    );
  }
};
