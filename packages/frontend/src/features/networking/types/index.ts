export interface Connection {
  id: number;
  user_id: number;
  connected_user_id: number;
  created_at: Date;
}

export interface ConnectionRequestResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ConnectionRequest {
  id: number;
  first_name: string;
  last_name: string;
  picture_upload_link: string | null;
  profession: string | null;
  company_name: string | null;
  country_of_origin: string | null;
  skills: string[] | null;
  role: 'MENTOR' | 'USER' | 'ADMIN';
  bio: string | null;
  linkedin_link: string | null;
  github_link: string | null;
  twitter_link: string | null;
  portfolio_link: string | null;
  connectionStatus: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NO_REQUEST';
    requestId: number | null;
    isIncoming: boolean | null;
    isSender: boolean | null;
  };
}
