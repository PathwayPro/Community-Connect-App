import { UsersSkills } from '@prisma/client';

export const UsersSkillsData: UsersSkills[] = [
  // User 1 (Test User1) skills
  { user_id: 1, skill_id: 1 }, // JavaScript
  { user_id: 1, skill_id: 2 }, // TypeScript
  { user_id: 1, skill_id: 3 }, // React
  { user_id: 1, skill_id: 4 }, // Node.js

  // User 2 (Test User2) skills
  { user_id: 2, skill_id: 5 }, // Python
  { user_id: 2, skill_id: 6 }, // Java
  { user_id: 2, skill_id: 7 }, // C#

  // User 7 (Test Mentor1) skills
  { user_id: 7, skill_id: 1 }, // JavaScript
  { user_id: 7, skill_id: 2 }, // TypeScript
  { user_id: 7, skill_id: 3 }, // React
  { user_id: 7, skill_id: 4 }, // Node.js
  { user_id: 7, skill_id: 9 }, // AWS
  { user_id: 7, skill_id: 10 }, // Docker

  // User 8 (Test Mentor2) skills
  { user_id: 8, skill_id: 5 }, // Python
  { user_id: 8, skill_id: 6 }, // Java
  { user_id: 8, skill_id: 11 }, // Kubernetes
  { user_id: 8, skill_id: 12 }, // DevOps

  // User 9 (Test Mentor3) skills
  { user_id: 9, skill_id: 13 }, // UI/UX Design
  { user_id: 9, skill_id: 14 }, // Project Management
  { user_id: 9, skill_id: 15 }, // Agile
];
