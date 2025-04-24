import { z } from 'zod';
import { ProfileVisibility } from '../../types';

export const formSchema = z.object({
  shareBirthDate: z.boolean().default(true),
  shareContactDetails: z.boolean().default(true),
  shareSocialLinks: z.boolean().default(true),
  profileVisibility: z
    .enum([
      ProfileVisibility.PUBLIC,
      ProfileVisibility.PRIVATE,
      ProfileVisibility.CONNECTIONS_ONLY
    ])
    .default(ProfileVisibility.PUBLIC)
});

export type GeneralSettingsFormValues = z.infer<typeof formSchema>;
