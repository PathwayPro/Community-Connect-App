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

export interface News {
  id: string;
  title: string;
  details: string;
  type: string;
  link: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: {
    first_name: string;
    last_name: string;
    picture_upload_link: string;
  };
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
  created_at: string;
  updated_at: string;
  user_id: number;
  user: {
    first_name: string;
    last_name: string;
    picture_upload_link: string;
  };
  type: string;
}

export interface ResourceFilters {
  title?: string;
  link?: string;
  user_id?: number;
  date_from?: string | null;
  date_to?: string | null;
}
