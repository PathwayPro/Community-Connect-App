export interface InterestsResponse {
  id: number;
  name: string;
}

export enum MentorStatus {
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
