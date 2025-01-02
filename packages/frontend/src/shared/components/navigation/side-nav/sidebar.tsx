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
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();

  const isPathActive = (path: string) => {
    return usePathname().startsWith(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  const linkClassName = cn(
    'flex flex-row h-11 text-white items-center gap-3 text-base font-medium rounded-md transition-all duration-200 hover:bg-neutral-200/10 hover:scale-[1.08]',
    !isSidebarOpen && 'justify-center'
  );

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col bg-primary p-6 transition-all duration-300',
        isSidebarOpen ? 'w-[260px]' : 'w-[92px]'
      )}
    >
      <Button
        onClick={toggleSidebar}
        className={cn(
          'group absolute z-10 h-7 w-7 rounded-full bg-neutral-light-400 p-0 hover:bg-neutral-light-600',
          isSidebarOpen ? 'left-[246px]' : 'left-[78px]'
        )}
      >
        <SharedIcons.chevronLeft
          className={cn(
            'h-6 w-6 stroke-primary transition-transform duration-300 group-hover:stroke-black',
            !isSidebarOpen && 'rotate-180'
          )}
        />
      </Button>
      <div className="mb-6 flex flex-row items-center gap-2">
        <SharedIcons.logo
          className={cn('h-10 w-10', isSidebarOpen && 'ml-4')}
        />
        {isSidebarOpen && (
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
        showText={isSidebarOpen}
        isPathActive={isPathActive}
      />

      <Separator className="my-6" />

      {/* Footer Site Nav */}
      <NavItem
        navItems={FooterSiteNav}
        linkClassName={linkClassName}
        showText={isSidebarOpen}
        isPathActive={isPathActive}
      />

      {/* Logout */}
      <div className="mt-auto text-white">
        <Link href="#" onClick={logout} className={linkClassName}>
          <SharedIcons.logout
            className={cn('h-6 w-6', isSidebarOpen && 'ml-4')}
          />
          {isSidebarOpen && 'Logout'}
        </Link>
      </div>
    </div>
  );
};
