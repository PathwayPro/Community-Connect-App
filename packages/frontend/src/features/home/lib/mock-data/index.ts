export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-liked', label: 'Most Liked' },
  { value: 'most-commented', label: 'Most Commented' }
];

export interface Thread {
  id: number;
  authorName: string;
  authorUsername: string;
  authorEmail: string;
  timeAgo: string;
  content: string;
  avatarUrl: string;
  imageUrl: string;
  likes: number;
  comments: number;
  tags?: string[];
  isSaved?: boolean;
  isLiked?: boolean;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
}

export interface Comment {
  id: number;
  authorName: string;
  authorUsername: string;
  timeAgo: string;
  content: string;
  avatarUrl: string;
  likes?: number;
  comments?: number;
  replies?: Comment[];
  liked_by_user?: boolean;
  saved_by_user?: boolean;
  parent_id?: number;
  post?: {
    id: number;
    message: string;
    created_at: string;
    published: boolean;
    user: {
      id: number;
      first_name: string;
      middle_name?: string;
      last_name: string;
      email: string;
      picture_upload_link?: string;
    };
  };
}

export const mockThreads: Thread[] = [
  {
    id: 1,
    authorName: 'Sarah Johnson',
    authorUsername: 'sarahj',
    authorEmail: 'sarahj@gmail.com',
    timeAgo: '2h',
    content:
      "Just deployed my first Next.js application! The new App Router is amazing for building complex applications. What's your favorite feature? #webdev #nextjs",
    avatarUrl: '/profile/msnobody.png',
    imageUrl: '/home/1.png',
    likes: 42,
    comments: 12,
    isSaved: false,
    tags: ['mentorship', 'events']
  },
  {
    id: 2,
    authorName: 'Alex Chen',
    authorUsername: 'alexc_dev',
    authorEmail: 'alexc_dev@gmail.com',
    timeAgo: '5h',
    content:
      "Exploring the power of Tailwind CSS and Shadcn UI. The developer experience is unmatched! Here's a sneak peek of my latest project built using the latest Next.js 14 App Router. Great for building complex applications and scalable websites. #webdev #tailwindcss #shadcn",
    avatarUrl: '/profile/mra.png',
    imageUrl: '/home/2.png',
    likes: 89,
    comments: 24,
    isSaved: false,
    tags: ['career', 'education', 'design']
  },
  {
    id: 3,
    authorName: 'Maria Garcia',
    authorUsername: 'maria_codes',
    authorEmail: 'maria_codes@gmail.com',
    timeAgo: '1d',
    content:
      "TypeScript tip of the day: Use discriminated unions for better type safety in your React components. It's a game changer! 🚀",
    avatarUrl: '/profile/mrnice.png',
    imageUrl: '/home/1.png',
    likes: 156,
    comments: 35,
    isSaved: true,
    tags: ['design', 'mentorship', 'events']
  },
  {
    id: 4,
    authorName: 'David Kim',
    authorUsername: 'davidk',
    authorEmail: 'davidk@gmail.com',
    timeAgo: '2d',
    content:
      'Just released a new open-source library for React animations. Check it out and let me know what you think! Link in bio ⚡️',
    avatarUrl: '/profile/mrnobody.png',
    imageUrl: '/home/2.png',
    likes: 267,
    comments: 58,
    isSaved: false,
    tags: ['documentaries', 'data analytics']
  },
  {
    id: 5,
    authorName: 'Emma Wilson',
    authorUsername: 'emmaw_tech',
    authorEmail: 'emmaw_tech@gmail.com',
    timeAgo: '3d',
    content:
      "Radix UI + Tailwind CSS is such a powerful combination for building accessible components. Here's my latest design system implementation.",
    avatarUrl: '/profile/mrnobody.png',
    imageUrl: '/home/1.png',
    likes: 193,
    comments: 45,
    isSaved: true,
    tags: ['mentorship', 'events']
  }
];

export const mockComments: Comment[] = [
  {
    id: 1,
    authorName: 'Sarah Johnson',
    authorUsername: 'sarahj',
    timeAgo: '2h',
    content: 'This is a comment',
    avatarUrl: '/profile/msnobody.png',
    likes: 10,
    comments: 0,
    replies: [],
    liked_by_user: false,
    saved_by_user: false
  },
  {
    id: 2,
    authorName: 'Alex Chen',
    authorUsername: 'alexc_dev',
    timeAgo: '5h',
    content: 'This is a comment',
    avatarUrl: '/profile/mra.png',
    likes: 15,
    comments: 0,
    replies: [],
    liked_by_user: false,
    saved_by_user: false
  },
  {
    id: 3,
    authorName: 'Maria Garcia',
    authorUsername: 'maria_codes',
    timeAgo: '1d',
    content: 'This is a comment',
    avatarUrl: '/profile/mrnice.png',
    likes: 25,
    comments: 2,
    replies: [
      {
        id: 1,
        authorName: 'Sarah Johnson',
        authorUsername: 'sarahj',
        timeAgo: '2h',
        content: 'This is a reply',
        avatarUrl: '/profile/msnobody.png',
        likes: 10,
        liked_by_user: false,
        saved_by_user: false
      },
      {
        id: 2,
        authorName: 'Alex Chen',
        authorUsername: 'alexc_dev',
        timeAgo: '5h',
        content: 'This is a reply',
        avatarUrl: '/profile/mra.png',
        likes: 15,
        liked_by_user: false,
        saved_by_user: false
      }
    ],
    liked_by_user: false,
    saved_by_user: true
  }
];
