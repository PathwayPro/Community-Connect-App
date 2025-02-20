export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-liked', label: 'Most Liked' },
  { value: 'most-commented', label: 'Most Commented' }
];

export const mockThreads = [
  {
    id: 1,
    authorName: 'Sarah Johnson',
    authorUsername: 'sarahj',
    timeAgo: '2h',
    content:
      "Just deployed my first Next.js application! The new App Router is amazing for building complex applications. What's your favorite feature? #webdev #nextjs",
    avatarUrl: '/profile/msnobody.png',
    imageUrl: '/home/1.png',
    likes: 42,
    comments: 12
  },
  {
    id: 2,
    authorName: 'Alex Chen',
    authorUsername: 'alexc_dev',
    timeAgo: '5h',
    content:
      "Exploring the power of Tailwind CSS and Shadcn UI. The developer experience is unmatched! Here's a sneak peek of my latest project.",
    avatarUrl: '/profile/mra.png',
    imageUrl: '/home/2.png',
    likes: 89,
    comments: 24
  },
  {
    id: 3,
    authorName: 'Maria Garcia',
    authorUsername: 'maria_codes',
    timeAgo: '1d',
    content:
      "TypeScript tip of the day: Use discriminated unions for better type safety in your React components. It's a game changer! 🚀",
    avatarUrl: '/profile/mrnice.png',
    imageUrl: '/home/1.png',
    likes: 156,
    comments: 35
  },
  {
    id: 4,
    authorName: 'David Kim',
    authorUsername: 'davidk',
    timeAgo: '2d',
    content:
      'Just released a new open-source library for React animations. Check it out and let me know what you think! Link in bio ⚡️',
    avatarUrl: '/profile/mrnobody.png',
    imageUrl: '/home/2.png',
    likes: 267,
    comments: 58
  },
  {
    id: 5,
    authorName: 'Emma Wilson',
    authorUsername: 'emmaw_tech',
    timeAgo: '3d',
    content:
      "Radix UI + Tailwind CSS is such a powerful combination for building accessible components. Here's my latest design system implementation.",
    avatarUrl: '/profile/mrnobody.png',
    imageUrl: '/home/1.png',
    likes: 193,
    comments: 45
  }
];
