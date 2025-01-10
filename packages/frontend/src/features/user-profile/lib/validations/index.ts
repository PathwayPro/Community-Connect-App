import { z } from 'zod';

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  city: z.string().min(1, 'City is required'),
  dob: z.date().optional(),
  languages: z.string().optional(),
  profession: z.string().min(1, 'Profession is required'),
  experience: z.string().min(1, 'Years of experience is required'),
  bio: z.string().min(1, 'Bio is required'),
  email: z.string().email().optional(),
  showDob: z.boolean().optional(),
  arrivalInCanada: z.string().optional(),
  goalId: z.string().optional(),
  province: z.string().optional(),
  pictureUploadLink: z.string().optional(),
  resumeUploadLink: z.string().optional(),
  linkedinLink: z.string().optional(),
  githubLink: z.string().optional(),
  twitterLink: z.string().optional(),
  portfolioLink: z.string().optional(),
  otherLinks: z.string().optional(),
  additionalLinks: z.array(z.string()).optional()
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
