import { z } from 'zod';
import { NewsType, resourceTypes, WorkSettings } from '../constants/enums';

// URL regex pattern that checks for common URL formats
export const urlPattern =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const newsFormSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  details: z.string({
    required_error: 'Content is required'
  }),
  type: z.enum(Object.values(NewsType) as [string, ...string[]]),
  link: z
    .string({
      required_error: 'Link is required'
    })
    .regex(urlPattern, 'Must be a valid URL'),
  published: z.boolean().optional().default(true),
  removeImage: z.boolean().optional()
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
  salary_range_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null) return undefined;
      return typeof val === 'string' ? parseInt(val, 10) : val;
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
  file: z.instanceof(File).optional().nullable(),
  removeImage: z.boolean().optional()
});

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

const resourceTypeValues = Object.values(resourceTypes).map(
  (type) => type.value
) as [string, ...string[]];

export const resourceFormSchema = z
  .object({
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
    type: z.enum(resourceTypeValues, {
      required_error: 'Resource type is required'
    }),
    link: z.string().regex(urlPattern, 'Must be a valid URL').optional(),
    file: z
      .any()
      .optional()
      .refine(
        (file) => {
          if (!file) return true;
          return file instanceof File;
        },
        {
          message: 'Invalid file format'
        }
      ),
    removeFile: z.boolean().optional()
  })
  .refine(
    (data) => {
      // At least one of link or file must be present
      const hasLink = data.link && data.link.trim() !== '';
      const hasFile = data.file && !data.removeFile;
      return hasLink || hasFile;
    },
    {
      message: 'Either a link or file must be provided',
      path: ['link'] // This will show the error on the link field
    }
  );

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
