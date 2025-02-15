import { z } from 'zod';

export const workModeOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' }
];

export const workModeTypes = {
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
  ON_SITE: 'ON_SITE'
} as const;

export const newsSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  subtitle: z.string().optional(),
  keywords: z.string().optional(),
  content: z.string({
    required_error: 'Content is required'
  }),
  published: z.boolean().optional().default(false),
  user_id: z.number().int().optional()
});

export type NewsFormValues = z.infer<typeof newsSchema>;

export const opportunitySchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  company_name: z.string({
    required_error: 'Company name is required'
  }),
  description: z.string({
    required_error: 'Description is required'
  }),
  salary_range: z.string({
    required_error: 'Salary range is required'
  }),
  work_mode: z.enum(Object.values(workModeTypes) as [string, ...string[]]),
  province: z.string({
    required_error: 'Province is required'
  }),
  city: z.string({
    required_error: 'City is required'
  }),
  link: z.string({
    required_error: 'Link is required'
  }),
  apply_link: z.string({
    required_error: 'Apply link is required'
  }),
  job_link: z.string({
    required_error: 'Job link is required'
  })
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;
