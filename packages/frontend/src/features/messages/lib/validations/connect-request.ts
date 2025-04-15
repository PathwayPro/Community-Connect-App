import { z } from 'zod';

export const connectRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message cannot exceed 500 characters')
});

export type ConnectRequestForm = z.infer<typeof connectRequestSchema>;
