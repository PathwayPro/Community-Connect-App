import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { eventApi } from '../api/event-api';
import { Event, EventCategory } from '../types';
import { EventFormData } from '../dto';

interface EventState {
  events: Event[];
  eventCategories: EventCategory[];
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  createEvent: (formData: EventFormData) => Promise<Event>;
  fetchEvents: () => Promise<void>;
  editEvent: (id: number, formData: EventFormData) => Promise<Event>;
  fetchEvent: (id: number) => Promise<void>;
  fetchEventCategories: () => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  revalidate: () => void;
}

export const useEventStore = create<EventState>()(
  devtools((set) => ({
    events: [],
    eventCategories: [],
    event: null,
    isLoading: false,
    error: null,
    createEvent: async (formData: EventFormData) => {
      try {
        set({ isLoading: true, error: null });
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

    revalidate: () => {
      set((state) => ({ ...state }));
    }
  }))
);
