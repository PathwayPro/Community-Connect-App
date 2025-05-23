import { z } from 'zod';
import { urlPattern } from '@/features/resources/lib/validation';

export const EventsTypes = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
} as const;

export const trueFalseOptions = [
  { value: true, label: 'True' },
  { value: false, label: 'False' }
];

export const FreePaidOptions = [
  { value: true, label: 'Free' },
  { value: false, label: 'Paid' }
];

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Event title must be at least 3 characters'),
  description: z
    .string()
    .min(20, 'Event description must be at least 20 characters'),
  category_id: z.string().min(1, 'Event category is required'),
  location: z.string().min(1, 'Event location is required').default('Online'),
  link: z
    .string()
    .regex(urlPattern, 'Must be a valid URL without "https://" prefix'),
  file: z.instanceof(File).optional().nullable(),
  is_free: z.boolean().default(true),
  type: z
    .enum(Object.values(EventsTypes) as [string, ...string[]])
    .default(EventsTypes.PUBLIC),
  requires_confirmation: z.boolean().default(false),
  accept_subscriptions: z.boolean().default(true),
  start_date: z.string().min(1, 'Event start date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required')
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
