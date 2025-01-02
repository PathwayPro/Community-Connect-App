import Link from 'next/link';
import { SharedIcons } from '@/shared/components/icons';
import { cn } from '@/shared/lib/utils';
// import { NavItem } from '@/shared/types';

interface NavItem {
  name: string;
  icon: string;
  href: string;
}

interface NavItemProps {
  navItems: NavItem[];
  linkClassName: string;
  showText?: boolean;
  isPathActive: (path: string) => boolean;
}

const NavItem = ({
  navItems,
  linkClassName,
  showText = true,
  isPathActive
}: NavItemProps) => {
  return (
    <nav className="flex flex-col gap-4">
      {navItems.map((item) => {
        const Icon = SharedIcons[item.icon as keyof typeof SharedIcons];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              linkClassName,
              isPathActive(item.href) && 'border border-white bg-neutral-200/10'
            )}
          >
            <Icon className={cn('ml-4 h-6 w-6', !showText && 'ml-0')} />
            {showText && item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavItem;
