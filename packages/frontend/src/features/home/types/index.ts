import { SharedIcons } from '@/shared/components/icons';

export interface NavItemProps {
  icon: keyof typeof SharedIcons;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface UserPosts {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  picture_upload_link?: string;
}

export interface ThreadResponse {
  id: number;
  // message?: string,
  content: string;
  image?: string;
  created_at: string;
  published?: boolean;
  user: UserPosts;
  likes_count: number;
  comments_count: number;
}

export interface PostCommentResponse {
  id: number;
  message: string;
  created_at: string;
  published: false;
  user: UserPosts;
  post: {
    id: number;
    message: string;
    created_at: string;
    published: boolean;
    user: UserPosts;
  };
}

// id: number;
// authorName: string;
// authorUsername: string;
// timeAgo: string;
// content: string;
// avatarUrl: string;
// likes?: number;
// comments?: number;
// replies?: Comment[];
