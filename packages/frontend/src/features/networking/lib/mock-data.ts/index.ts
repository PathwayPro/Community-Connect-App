import { COUNTRIES } from '@/features/networking/lib/mock-data.ts/constants/networking';

export const skillsList = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'AWS',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'SQL',
  'MongoDB',
  'REST APIs',
  'CI/CD',
  'Git',
  'Agile',
  'Scrum',
  'UI/UX',
  'Figma',
  'Adobe XD',
  'Data Analysis',
  'Machine Learning',
  'Cloud Architecture',
  'DevOps',
  'System Design'
];

export const professions = [
  'Software Architect',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'Marketing Director',
  'Frontend Developer',
  'Business Analyst',
  'DevOps Engineer',
  'Content Strategist',
  'Backend Developer',
  'Project Manager',
  'Security Engineer'
];

export const getProfessions = () => {
  return professions.map((profession) => ({
    label: profession,
    value: profession
  }));
};

export const getSkills = () => {
  return skillsList.map((skill) => ({
    label: skill,
    value: skill
  }));
};

export const getCountries = () => {
  return COUNTRIES.map((country) => ({
    label: country.name,
    value: country.name
  }));
};
