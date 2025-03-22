import { z } from 'zod';

export const EventsTypes = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
} as const;

export const EventTicketTypes = {
  PAID: 'PAID',
  FREE: 'FREE'
} as const;

export const trueFalseOptions = [
  { value: false, label: 'False' },
  { value: true, label: 'True' }
];

export const eventFormSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Event description is required'),
  category_id: z.string().min(1, 'Event category is required'),
  location: z.string().optional(),
  link: z.string().url('Must be a valid URL').optional(),
  image: z.string().optional(),
  price: z.enum(Object.values(EventTicketTypes) as [string, ...string[]]),
  type: z
    .enum(Object.values(EventsTypes) as [string, ...string[]])
    .default('PUBLIC'),
  requires_confirmation: z.boolean().default(false),
  accept_subscriptions: z.boolean().default(true),
  date: z.string().default(new Date().toISOString()),
  start_time: z.string().default(new Date().toISOString()).optional(),
  end_time: z.string().default(new Date().toISOString()).optional()
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
