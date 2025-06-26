import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { eventApi } from '../api/event-api';
import { Event, EventCategory, EventSubscription } from '../types';
import {
  EventFormData,
  FilterEventsSubscriptionDto,
  UpdateEventSubscriptionDto
} from '../dto';

interface EventState {
  events: Event[];
  eventCategories: EventCategory[];
  event: Event | null;
  eventForEdit: Event | null;
  isLoading: boolean;
  eventSubscriptions: EventSubscription[];
  error: string | null;
  createEvent: (formData: EventFormData) => Promise<Event>;
  createEventSubscription: (eventId: number) => Promise<EventSubscription>;
  fetchEvents: () => Promise<void>;
  fetchEventSubscriptions: (
    filters: FilterEventsSubscriptionDto
  ) => Promise<void>;
  updateEventSubscription: (
    id: number,
    data: UpdateEventSubscriptionDto
  ) => Promise<EventSubscription>;
  editEvent: (id: number, formData: EventFormData) => Promise<Event>;
  fetchEvent: (id: number) => Promise<void>;
  fetchEventForEdit: (id: number) => Promise<void>;
  fetchEventCategories: () => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  clearEventForEdit: () => void;
  revalidate: () => void;
}

export const useEventStore = create<EventState>()(
  devtools((set) => ({
    events: [],
    eventCategories: [],
    event: null,
    eventForEdit: null,
    isLoading: false,
    eventSubscriptions: [],
    error: null,
    createEvent: async (formData: EventFormData) => {
      try {
        set({ isLoading: true, error: null });

        console.log('FormData contents:');
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        const response = await eventApi.createEvent(formData);

        if (!response.success) {
          throw new Error('Failed to create event');
        }

        const newEvent = response.data as unknown as Event;
        set((state) => ({
          events: [...state.events, newEvent],
          isLoading: false
        }));
        set((state) => {
          const newState = { ...state, isLoading: false };
          newState.revalidate();
          return newState;
        });
        return newEvent;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    fetchEvents: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.getEvents();

        if (!response.success) {
          throw new Error('Failed to fetch events');
        }

        const events = response.data;
        set({ events: events as unknown as Event[], isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchEvent: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.getEventById(id);

        if (!response.success) {
          throw new Error('Failed to fetch event');
        }

        const event = response.data;
        console.log('event response data  in fecth event: ', response);
        set({ event: event as unknown as Event, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchEventCategories: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.getEventCategories();

        if (!response.success) {
          throw new Error('Failed to fetch event categories');
        }

        const eventCategories = response.data;
        set({
          eventCategories: eventCategories as unknown as EventCategory[],
          isLoading: false
        });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    editEvent: async (id: number, formData: EventFormData) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.updateEvent(id, formData);

        if (!response.success) {
          throw new Error('Failed to update event');
        }

        const updated = response.data as unknown as Event;
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updated } : event
          ),
          isLoading: false
        }));
        set((state) => {
          const newState = { ...state, isLoading: false };
          newState.revalidate();
          return newState;
        });
        return updated;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    createEventSubscription: async (eventId: number) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.createEventSubscription(eventId);

        if (!response.success) {
          throw new Error('Failed to create event subscription');
        }

        const newEventSubscription =
          response.data as unknown as EventSubscription;

        console.log(
          'newEventSubscription response data: ',
          newEventSubscription
        );

        set((state) => ({
          eventSubscriptions: [
            ...(state.eventSubscriptions || []),
            newEventSubscription
          ],
          isLoading: false
        }));
        return newEventSubscription;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    updateEventSubscription: async (
      id: number,
      data: UpdateEventSubscriptionDto
    ) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.updateEventSubscription(id, data);

        if (!response.success) {
          throw new Error('Failed to update event subscription');
        }

        const updated = response.data as unknown as EventSubscription;
        set((state) => ({
          eventSubscriptions: state.eventSubscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updated } : sub
          ),
          isLoading: false
        }));
        return updated;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    fetchEventSubscriptions: async (filters: FilterEventsSubscriptionDto) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.getEventSubscriptions(filters);

        if (!response.success) {
          throw new Error('Failed to fetch event subscriptions');
        }

        const eventSubscriptions = response.data;

        set({
          eventSubscriptions:
            eventSubscriptions as unknown as EventSubscription[],
          isLoading: false
        });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    deleteEvent: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.deleteEvent(id);

        if (!response.success) {
          throw new Error('Failed to delete event');
        }

        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          isLoading: false
        }));
        set((state) => {
          const newState = { ...state, isLoading: false };
          newState.revalidate();
          return newState;
        });
        return response.success;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchEventForEdit: async (id: number) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.getEventById(id);

        if (!response.success) {
          throw new Error('Failed to fetch event for edit');
        }

        const event = response.data;
        set({ eventForEdit: event as unknown as Event, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    clearEventForEdit: () => {
      set({ eventForEdit: null });
    },

    revalidate: () => {
      set((state) => ({ ...state }));
    }
  }))
);
