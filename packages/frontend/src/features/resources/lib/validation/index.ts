import { z } from 'zod';
import { resourceTypes, WorkSettings } from '../constants/enums';

// export const workModeOptions = [
//   { value: WorkSettings.REMOTE, label: 'Remote' },
//   { value: WorkSettings.HYBRID, label: 'Hybrid' },
//   { value: WorkSettings.ON_SITE, label: 'On-site' }
// ];

export const newsFormSchema = z.object({
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

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export const opportunityFormSchema = z.object({
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
  work_mode: z.enum(Object.values(WorkSettings) as [string, ...string[]]),
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

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

const resourceTypeValues = Object.values(resourceTypes).map(
  (type) => type.value
) as [string, ...string[]];

export const resourceFormSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required'
    })
    .min(3, 'Title must be at least 3 characters'),
  details: z
    .string({
      required_error: 'Details are required'
    })
    .min(10, 'Details must be at least 10 characters'),
  type: z.enum(resourceTypeValues),
  link: z
    .string({
      required_error: 'Link is required'
    })
    .url('Must be a valid URL')
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
