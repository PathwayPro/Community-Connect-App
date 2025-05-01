export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MENTOR = 'MENTOR'
}

export interface UserProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  dob?: string;
  ageRange?: string;
  arrivalInCanada?: string;
  goalId?: string;
  role?: RoleEnum;
  province?: string;
  city?: string;
  profession?: string;
  experience?: string;
  bio?: string;
  pictureUploadLink?: string;
  resumeUploadLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  twitterLink?: string;
  portfolioLink?: string;
  otherLinks?: string;
  additionalLinks?: string[];
  languages?: string;
  countryOfOrigin?: string;
  workStatus?: string;
  companyName?: string;
  skills?: string[];
  activelySearching?: boolean;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
  emailVerified?: boolean;
}

export interface UserResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface SkillsResponse {
  id: number;
  name: string;
}
