export enum RolesEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MENTOR = 'MENTOR',
}

export type RolesEnumType = (typeof RolesEnum)[keyof typeof RolesEnum];
