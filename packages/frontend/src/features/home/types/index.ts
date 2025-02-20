import { SharedIcons } from '@/shared/components/icons';

export interface NavItemProps {
  icon: keyof typeof SharedIcons;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}
