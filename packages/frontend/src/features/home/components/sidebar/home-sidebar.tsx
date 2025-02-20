'use client';

import { useState } from 'react';
import { IconInput } from '@/shared/components/ui/icon-input';
import { NavItem } from './nav-item';
import { navItems } from './config/site';

export const HomeSidebar = () => {
  const [activeTab, setActiveTab] = useState<string>('threads');

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <IconInput
          leftIcon="search"
          className="w-[250px] rounded-full bg-neutral-light-100"
          placeholder="Search"
        />
      </div>

      {/* Main Menu */}
      <div className="space-y-1">
        <p className="px-3 text-sm font-medium text-muted-foreground">MENU</p>
        {navItems.menuNavItems.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            isActive={activeTab === item.label}
            onClick={() => setActiveTab(item.label)}
          />
        ))}
      </div>

      {/* Personal Navigator */}
      <div className="space-y-1">
        <p className="px-3 text-sm font-medium text-muted-foreground">
          PERSONAL NAVIGATOR
        </p>
        {navItems.personalNavItems.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            isActive={activeTab === item.label}
            onClick={() => setActiveTab(item.label)}
          />
        ))}
      </div>
    </div>
  );
};
