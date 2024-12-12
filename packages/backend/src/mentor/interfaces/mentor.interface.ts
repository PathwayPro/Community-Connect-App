import { MentorStatus } from './mentorStatus.enum';

export interface Mentor {
  id: number;
  maxMentees: number;
  availability: string;
  hasExperience: boolean;
  experienceDetails?: string;
  status: MentorStatus;
  userId: number;
}
