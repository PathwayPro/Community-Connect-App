import { z } from 'zod';
import { NewsType, resourceTypes, WorkSettings } from '../constants/enums';

// URL regex pattern that checks for common URL formats
export const urlPattern =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const newsFormSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  // subtitle: z.string().optional(),
  // keywords: z.string().optional(),
  details: z.string({
    required_error: 'Content is required'
  }),
  type: z.enum(Object.values(NewsType) as [string, ...string[]]),
  link: z
    .string({
      required_error: 'Link is required'
    })
    .regex(urlPattern, 'Must be a valid URL'),
  published: z.boolean().optional().default(true)
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export const opportunityFormSchema = z.object({
  job: z.string({
    required_error: 'Job title is required'
  }),
  company: z.string({
    required_error: 'Company name is required'
  }),
  description: z.string({
    required_error: 'Description is required'
  }),
  experience: z.string({
    required_error: 'Experience is required'
  }),
  salary_range_id: z.string({
    required_error: 'Salary range is required'
  }),
  settings: z.enum(Object.values(WorkSettings) as [string, ...string[]]),
  province: z.string({
    required_error: 'Province is required'
  }),
  city: z.string({
    required_error: 'City is required'
  }),
  link_apply: z
    .string({
      required_error: 'Apply link is required'
    })
    .regex(urlPattern, 'Must be a valid URL'),
  link_post: z
    .string({
      required_error: 'Job post link is required'
    })
    .regex(urlPattern, 'Must be a valid URL'),
  file: z.instanceof(File).optional()
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
    .regex(urlPattern, 'Must be a valid URL')
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
