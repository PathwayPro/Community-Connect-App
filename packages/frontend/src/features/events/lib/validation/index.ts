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
  subtitle: z.string().optional(),
  description: z
    .string()
    .min(20, 'Event description must be at least 20 characters'),
  category_id: z.string().min(1, 'Event category is required'),
  location: z.string().optional(),
  link: z
    .string({
      required_error: 'Link is required'
    })
    .regex(urlPattern, 'Must be a valid URL'),
  image: z.string().optional(),
  is_free: z.boolean().default(true),
  type: z
    .enum(Object.values(EventsTypes) as [string, ...string[]])
    .default('PUBLIC'),
  requires_confirmation: z.boolean().default(false),
  accept_subscriptions: z.boolean().default(true),
  start_date: z.string().default(new Date().toISOString()),
  start_time: z.string().default(new Date().toISOString()).optional(),
  end_time: z.string().default(new Date().toISOString()).optional()
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
