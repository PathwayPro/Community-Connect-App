import { NavItemProps } from '@/features/home/types';

export const navItems: {
  menuNavItems: NavItemProps[];
  personalNavItems: NavItemProps[];
} = {
  menuNavItems: [
    { icon: 'list', label: 'Threads', filter: 'THREADS' },
    // {icon: 'tag',label: 'Tags'},
    { icon: 'bookmark', label: 'Saved', filter: 'SAVED' }
  ],
  personalNavItems: [
    { icon: 'list', label: 'Your Threads', filter: 'MY_THREADS' },
    {
      icon: 'messageSquare',
      label: 'Your Contributions',
      filter: 'MY_MESSAGES'
    },
    { icon: 'heart', label: 'Your Reactions', filter: 'MY_LIKES' }
  ]
};
