'use client';

import Link from 'next/link';
import { SharedIcons } from '@/shared/components/icons';
import { Separator } from '../../ui/separator';
import {
  MainSiteNav,
  FooterSiteNav
} from '@/shared/components/navigation/config';
import NavItem from './nav-item';
import { Button } from '../../ui/button';
import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isPathActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    onToggle(!isOpen);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  const linkClassName = cn(
    'sticky flex-row h-11 text-white items-center gap-3 text-base font-medium rounded-md transition-all duration-200 hover:bg-neutral-200/10 hover:scale-[1.08]',
    !isOpen && 'justify-center'
  );

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-primary p-6 transition-all duration-300',
        isOpen ? 'w-[260px]' : 'w-[92px]'
      )}
    >
      <Button
        onClick={toggleSidebar}
        className={cn(
          'group absolute z-10 h-7 w-7 rounded-full bg-neutral-light-400 p-0 hover:bg-neutral-light-600',
          isOpen ? 'left-[246px]' : 'left-[78px]'
        )}
      >
        <SharedIcons.chevronLeft
          className={cn(
            'h-6 w-6 stroke-primary transition-transform duration-300 group-hover:stroke-black',
            !isOpen && 'rotate-180'
          )}
        />
      </Button>
      <div className="mb-6 flex flex-row items-center gap-2">
        <SharedIcons.logo className={cn('h-10 w-10', isOpen && 'ml-4')} />
        {isOpen && (
          <div className="flex flex-col text-sm font-extrabold">
            <p className="text-white">Community</p>
            <p className="text-white">Connect</p>
          </div>
        )}
      </div>

      {/* Main Site Nav */}
      <NavItem
        navItems={MainSiteNav}
        linkClassName={linkClassName}
        showText={isOpen}
        isPathActive={isPathActive}
        onExpandSidebar={toggleSidebar}
      />

      <Separator className="my-6" />

      {/* Footer Site Nav */}
      <NavItem
        navItems={FooterSiteNav}
        linkClassName={linkClassName}
        showText={isOpen}
        isPathActive={isPathActive}
      />

      {/* Logout */}
      <div className="mt-auto text-white">
        <Link href="#" onClick={handleLogout} className={linkClassName}>
          <SharedIcons.logout className={cn('h-6 w-6', isOpen && 'ml-4')} />
          {isOpen && 'Logout'}
        </Link>
      </div>
    </div>
  );
};
