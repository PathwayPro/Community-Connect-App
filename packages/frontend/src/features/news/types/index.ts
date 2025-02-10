export interface CreateNewsDTO {
  title: string;
  subtitle?: string;
  keywords?: string;
  content: string;
  published?: boolean;
  user_id?: number;
}

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
