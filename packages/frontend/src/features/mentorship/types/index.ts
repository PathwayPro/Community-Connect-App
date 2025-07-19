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

export type RatingsGroup = {
  motivational: number;
  communication: number;
  knowledge: number;
  problemSolving: number;
};

export interface MentorshipAdmin {
  id: number;
  mentorApplicationId?: number; // Add this field
  identity: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
  experience?: string;
  experienceDescription?: string;
  profession: string;
  email: string;
  status?: 'Approved' | 'Pending' | 'Rejected';
  capacity?: string;
  availability?: string;
  lastSession?: string;
  sessionsBooked?: number;
  ratings?: number;
  review?: string;
  ratingsGroup?: RatingsGroup;
  resume?: string;
}

export type Mentee = {
  id: number;
  menteeApplicationId?: number; // Add this field
  identity: {
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  profession: string;
  status: MenteeStatus;
  email: string;
  reason: string;
  experience?: string;
  resume?: string; // Add this field
};

// New types for mentor dashboard
export interface MentorStatistics {
  minutesMentored: number;
  minutesMentoredDiff: number;
  mentees: number;
  menteesDiff: number;
  liveSessions: number;
  liveSessionsDiff: number;
}

export interface MentorUpcomingSessions {
  id: number;
  avatar?: string;
  mentee: string;
  lastMet?: string;
  profession?: string;
  link: string;
}

export interface MyMentees {
  id: number;
  avatar?: string;
  mentee: string;
  email: string;
  profession?: string;
  status: string;
}

export interface MyMentorDashboard {
  statistics: MentorStatistics;
  upcomingSessions: MentorUpcomingSessions[];
  mentees: MyMentees[];
}
