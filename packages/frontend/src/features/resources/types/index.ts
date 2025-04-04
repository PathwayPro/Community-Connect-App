export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  details: string;
  keywords: string[];
  postedAt: string;
  postedBy: string;
}

export interface JobCardProps {
  id?: string;
  companyLogo: string;
  companyName: string;
  jobTitle: string;
  experience: string;
  location: string;
  salaryRange: string;
  jobType: string;
  jobDescription?: string;
  onApply: () => void;
  onLearnMore?: () => void;
}

export interface Resource {
  id: string;
  title: string;
  link: string;
  created_at: Date;
  updated_at: Date;
  user_id: number;
}

export interface ResourceFilters {
  title?: string;
  link?: string;
  user_id?: number;
  date_from?: Date | null;
  date_to?: Date | null;
}
