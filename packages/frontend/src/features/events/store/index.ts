import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CreateEventDto, UpdateEventDto } from '../dto';
import { eventApi } from '../api/event-api';
import { Event, EventCategory } from '../types';

interface EventState {
  events: Event[];
  eventCategories: EventCategory[];
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  createEvent: (event: CreateEventDto) => Promise<Event>;
  fetchEvents: () => Promise<void>;
  editEvent: (id: number, updatedEvent: UpdateEventDto) => Promise<Event>;
  fetchEvent: (id: number) => Promise<void>;
  fetchEventCategories: () => Promise<void>;
  deleteEvent: (id: number) => Promise<boolean | undefined>;
  revalidate: () => void;
}

export const useEventStore = create<EventState>()(
  devtools((set) => ({
    events: [],
    isLoading: false,
    error: null,
    event: null,
    createEvent: async (event) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.createEvent(event);

        if (!response.success) {
          throw new Error('Failed to create event');
        }

        const newEvent = response.data as unknown as Event;
        set((state) => {
          const newState = {
            ...state,
            events: [...state.events, newEvent],
            isLoading: false
          } as EventState;
          newState.revalidate();
          return newState;
        });
        return newEvent;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
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

    editEvent: async (id, updatedEvent) => {
      try {
        set({ isLoading: true, error: null });
        const response = await eventApi.updateEvent(id, updatedEvent);

        if (!response.success) {
          throw new Error('Failed to update event');
        }

        const updated = response.data;
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
