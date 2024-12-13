import { mentors_status } from '@prisma/client';

export interface UpdateMentor {
  max_mentees?: number;
  availability?: string;
  has_experience?: boolean;
  experience_details?: string;
  status?: mentors_status;
}
