import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(
      /^(\+?\d{1,4}[-.\s]?)?\(?\d{1,}\)?[-.\s]?\d{1,}[-.\s]?\d{1,}$/,
      'Please enter a valid phone number'
    )
    .optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
