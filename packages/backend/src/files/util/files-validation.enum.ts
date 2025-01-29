export enum FileValidationEnum {
  PROFILE_PICTURE = 'PROFILE_PICTURE',
  RESOURCES = 'RESOURCES',
  EVENTS = 'EVENTS',
  NEWS = 'NEWS',
  RESUME = 'RESUME',
}

export type FileValidationEnumType =
  (typeof FileValidationEnum)[keyof typeof FileValidationEnum];
