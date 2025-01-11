import { z } from 'zod';

export const mentorStatusEnum = z.enum(['PENDING', 'ACTIVE', 'INACTIVE']);

export const mentorSchema = z.object({
  firstName: z.string().min(2).max(32),
  lastName: z.string().min(2).max(32),
  profession: z.string().min(2).max(32),
  experience: z.number().int(),
  max_mentees: z.number().int(),
  availability: z.string(),
  has_experience: z.boolean().default(false),
  experience_details: z.string().optional(),
  status: mentorStatusEnum.optional().default('PENDING'),
  user_id: z.number().int().optional(),
  resume_upload_link: z.string().optional()
});

export type MentorSchema = z.infer<typeof mentorSchema>;
