import { NavItemProps } from '@/features/home/types';

export const navItems: {
  menuNavItems: NavItemProps[];
  personalNavItems: NavItemProps[];
} = {
  menuNavItems: [
    {
      icon: 'list',
      label: 'Threads'
    },
    {
      icon: 'tag',
      label: 'Tags'
    },
    {
      icon: 'bookmark',
      label: 'Saved'
    }
  ],
  personalNavItems: [
    {
      icon: 'list',
      label: 'Your Threads'
    },
    {
      icon: 'messageSquare',
      label: 'Your Contributions'
    },
    {
      icon: 'heart',
      label: 'Your Reactions'
    }
  ]
};
