export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MENTOR = 'MENTOR'
}

export interface UserProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dob?: string;
  showDob?: boolean;
  arrivalInCanada?: string;
  goalId?: string;
  role?: RoleEnum;
}
