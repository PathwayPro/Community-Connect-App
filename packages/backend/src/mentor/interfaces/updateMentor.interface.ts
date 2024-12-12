//import { MentorStatus } from "./mentorStatus.enum";
import { MentorStatus } from '@prisma/client';

export interface UpdateMentor {
  maxMentees?: number;
  availability?: string;
  hasExperience?: boolean;
  experienceDetails?: string;
  status?: MentorStatus;
}
