// Resource Template Types
export const resourceTypes = [
  { value: 'RESUME', label: 'Resume Template' },
  { value: 'COVER_LETTER', label: 'Cover Letter Template' },
  { value: 'LINKEDIN', label: 'LinkedIn Banner Template' },
  { value: 'BUSINESS_CARD', label: 'Business Card Template' },
  { value: 'EMAIL_SIGNATURE', label: 'Email Signature Template' },
  { value: 'PORTFOLIO', label: 'Portfolio Layout Template' },
  { value: 'PERSONAL_BRANDING', label: 'Personal Branding Kit' },
  { value: 'JOB_APPLICATION_TRACKER', label: 'Job Application Tracker' },
  { value: 'INTERVIEW_PREP', label: 'Interview Prep Kit' },
  { value: 'NETWORKING_TIPS', label: 'Networking Tips' },
  { value: 'CAREER_PLANNING', label: 'Career Planning Guide' },
  { value: 'SALARY_NEGOTIATION', label: 'Salary Negotiation Guide' },
  { value: 'INVOICE', label: 'Invoice Template' },
  { value: 'BANNER', label: 'Banner Template' },
  { value: 'OTHER', label: 'Other' }
];

// News Types
export enum NewsType {
  FEATURED_POST = 'FEATURED_POST',
  EDITORS_PICK = 'EDITORS_PICK'
}

// Work Settings
export enum WorkSettings {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ON_SITE = 'ON_SITE'
}
