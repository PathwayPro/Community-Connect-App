export enum FileValidationEnum {
    PROFILE_PICTURE = 'PROFILE_PICTURE',
    RESOURCES = 'RESOURCES',
    EVENTS = 'EVENTS',
    NEWS = 'NEWS'
  }

  export type FileValidationEnumType = (typeof FileValidationEnum)[keyof typeof FileValidationEnum];