import { z } from 'zod';

export const EventsTypes = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
} as const;

export const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category_id: z.number().int().positive('Category is required'),
  location: z.string().optional(),
  link: z.string().url('Must be a valid URL').optional(),
  image: z.string().optional(),
  price: z.number().min(0).optional().default(0),
  type: z.enum(['PUBLIC', 'PRIVATE'] as const).default('PUBLIC'),
  requires_confirmation: z.boolean().default(false),
  accept_subscriptions: z.boolean().default(true)
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
