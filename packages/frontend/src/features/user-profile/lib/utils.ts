import { arrivalInCanadaOptions, skillsOptions } from './constants/profile';

export const getSkillLabel = (value: string) => {
  return (
    skillsOptions.find((option) => option.value === value)?.label ||
    'Not specified'
  );
};

export const getArrivalInCanadaLabel = (value: string) => {
  return (
    arrivalInCanadaOptions.find((option) => option.value === value)?.label ||
    'Not specified'
  );
};
