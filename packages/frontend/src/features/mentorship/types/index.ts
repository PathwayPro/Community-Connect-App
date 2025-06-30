export interface InterestsResponse {
  id: number;
  name: string;
}

export enum MentorStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum MenteeStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface CreateMentorDto {
  max_mentees: number;
  availability: string;
  has_experience: boolean;
  experience_details?: string;
  interests?: number[];
}

export interface MentorResponse {
  id: number;
  max_mentees: number;
  availability: string;
  has_experience: boolean;
  experience_details?: string;
  interests?: number[];
  status: MentorStatus;
  user_id: number;
}

export interface MenteeResponse {
  id: number;
  reason: string;
  interests?: number[];
  status: MenteeStatus;
  user_id: number;
}

export interface PendingApplicationResponse {
  status: MenteeStatus | MentorStatus;
  created_at: string;
  activityType: 'MENTOR' | 'MENTEE';
}

export interface AdminMentorshipDashboardTotals {
  totalMentors: number;
  totalMentees: number;
  mentorApplicationsLastMonth: number;
  menteeApplicationsLastMonth: number;
  mentorApplicationsCurrentMonth: number;
  menteeApplicationsCurrentMonth: number;
}
