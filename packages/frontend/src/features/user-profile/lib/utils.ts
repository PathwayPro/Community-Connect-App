import { arrivalInCanadaOptions } from './constants/profile';
import { SkillsResponse } from '../types';

export const getSkillLabel = (value: number, skills: SkillsResponse[]) => {
  return skills.find((option) => option.id === value)?.name || 'Not specified';
};

export const getArrivalInCanadaLabel = (value: string) => {
  return (
    arrivalInCanadaOptions.find((option) => option.value === value)?.label ||
    'Not specified'
  );
};
