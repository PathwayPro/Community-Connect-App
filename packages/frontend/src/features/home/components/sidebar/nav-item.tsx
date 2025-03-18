'use client';

import { SharedIcons } from '@/shared/components/icons';
import { cn } from '@/shared/lib/utils';

interface NavItemProps {
  icon: keyof typeof SharedIcons;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const NavItem = ({
  icon,
  label,
  isActive = false,
  onClick
}: NavItemProps) => {
  const Icon = SharedIcons[icon];

  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
        'hover:bg-primary-100 hover:text-white',
        isActive && 'bg-primary text-white hover:bg-primary'
      )}
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span>{label}</span>
    </button>
  );
};
