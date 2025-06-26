import { z } from 'zod';

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  city: z.string().min(1, 'City is required'),
  dob: z.string().optional(),
  ageRange: z.string().optional(),
  languages: z.string().optional(),
  profession: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  email: z.string().email().optional(),
  arrivalInCanada: z.string().optional(),
  goalId: z.string().optional(),
  province: z.string().optional(),
  pictureUploadLink: z.union([z.string(), z.instanceof(File)]).optional(),
  resumeUploadLink: z.union([z.string(), z.instanceof(File)]).optional(),
  linkedinLink: z.string().optional(),
  githubLink: z.string().optional(),
  twitterLink: z.string().optional(),
  portfolioLink: z.string().optional(),
  otherLinks: z.string().optional(),
  additionalLinks: z.array(z.string()).optional(),
  skills: z
    .array(z.union([z.string(), z.number()]).transform((val) => Number(val)))
    .optional(),
  workStatus: z.string().optional(),
  companyName: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  activelySearching: z.boolean().optional().default(false),
  removeProfilePicture: z.boolean().optional(),
  removeResume: z.boolean().optional()
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
