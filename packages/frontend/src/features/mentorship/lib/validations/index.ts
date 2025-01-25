import { z } from 'zod';

export const mentorStatusEnum = z.enum(['PENDING', 'ACTIVE', 'INACTIVE']);

export const mentorSchema = z.object({
  firstName: z.string().min(2).max(32),
  lastName: z.string().min(2).max(32),
  profession: z.string().min(2).max(32),
  experience: z.coerce.number().int().min(0),
  max_mentees: z.coerce.number().int().min(1),
  availability: z.string(),
  has_experience: z.boolean().default(false),
  experience_details: z.string().optional(),
  resume_upload_link: z.string().optional(),
  interests: z.array(z.coerce.number().int()).optional()
});

export type MentorSchema = z.infer<typeof mentorSchema>;
