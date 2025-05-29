import {
  arrivalInCanadaOptions,
  goalsOptions,
  workStatusData,
  provinceData,
  skillsOptions,
  ageRangeData
} from '@/features/user-profile/lib/constants/profile';

// Helper functions for filter display
export const getFilterDisplayName = (filterKey: string): string => {
  const keyDisplayMap: Record<string, string> = {
    goals: 'Goals',
    arrivalInCanada: 'Arrival in Canada',
    province: 'Province',
    workStatus: 'Work Status',
    ageRange: 'Age Range',
    skills: 'Skills',
    activelySearching: 'Actively Searching',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    city: 'City'
  };

  return (
    keyDisplayMap[filterKey] ||
    filterKey.charAt(0).toUpperCase() + filterKey.slice(1)
  );
};

export const getFilterDisplayValue = (
  filterKey: string,
  value: string | number | boolean | string[] | number[],
  skillsFromBackend?: Array<{ id: string; name: string }>
): string => {
  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle array values
  if (Array.isArray(value)) {
    if (value.length === 0) return 'None';
    if (value.length === 1) {
      return getFilterDisplayValue(filterKey, value[0], skillsFromBackend);
    }
    return `${value.length} selected`;
  }

  // Handle string/number values based on filter key
  switch (filterKey) {
    case 'goals':
      return (
        goalsOptions.find((option) => option.value === String(value))?.label ||
        String(value)
      );

    case 'arrivalInCanada':
      return (
        arrivalInCanadaOptions.find((option) => option.value === String(value))
          ?.label || String(value)
      );

    case 'province':
      return (
        provinceData.find((option) => option.value === String(value))?.label ||
        String(value)
      );

    case 'workStatus':
      return (
        workStatusData.find((option) => option.value === String(value))
          ?.label || String(value)
      );

    case 'ageRange':
      return (
        ageRangeData.find((option) => option.value === String(value))?.label ||
        String(value)
      );

    case 'skills':
      // First try to find in backend skills data
      if (skillsFromBackend) {
        const backendSkill = skillsFromBackend.find(
          (skill) => skill.id === String(value)
        );
        if (backendSkill) return backendSkill.name;
      }
      // Fallback to sample skills options
      return (
        skillsOptions.find((option) => option.value === String(value))?.label ||
        String(value)
      );

    default:
      return String(value);
  }
};
