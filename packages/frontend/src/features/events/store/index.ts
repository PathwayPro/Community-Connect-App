import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  // Add other event properties as needed
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  createEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  fetchEvents: () => Promise<void>;
  editEvent: (id: string, updatedEvent: Partial<Event>) => Promise<void>;
}

export const useEventStore = create<EventState>()(
  devtools((set) => ({
    events: [],
    isLoading: false,
    error: null,

    createEvent: async (event) => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        });

        if (!response.ok) {
          throw new Error('Failed to create event');
        }

        const newEvent = await response.json();
        set((state) => ({
          events: [...state.events, newEvent],
          isLoading: false
        }));
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchEvents: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch('/api/events');

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const events = await response.json();
        set({ events, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    editEvent: async (id, updatedEvent) => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch(`/api/events/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedEvent)
        });

        if (!response.ok) {
          throw new Error('Failed to update event');
        }

        const updated = await response.json();
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updated } : event
          ),
          isLoading: false
        }));
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    }
  }))
);
