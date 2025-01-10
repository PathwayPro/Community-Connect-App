'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SharedIcons } from '@/shared/components/icons';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  name: string;
  icon: string;
  href: string;
  subItems?: NavSubItem[];
}

interface NavSubItem {
  name: string;
  href: string;
}

interface NavItemProps {
  navItems: NavItem[];
  linkClassName: string;
  showText?: boolean;
  isPathActive: (path: string) => boolean;
  onExpandSidebar?: () => void;
}

const NavItem = ({
  navItems,
  linkClassName,
  showText = true,
  isPathActive,
  onExpandSidebar
}: NavItemProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const handleItemClick = (href: string) => {
    if (!showText && onExpandSidebar) {
      onExpandSidebar();
    }
    toggleExpand(href);
  };

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = SharedIcons[item.icon as keyof typeof SharedIcons];
        const isExpanded = expandedItems.includes(item.href);
        const hasSubItems = item.subItems && item.subItems.length > 0;

        return (
          <div key={item.href} className="flex flex-col">
            {hasSubItems ? (
              <div
                className={cn(
                  linkClassName,
                  'flex cursor-pointer items-center justify-between',
                  isPathActive(item.href) &&
                    'border border-white bg-neutral-200/10'
                )}
                onClick={() => handleItemClick(item.href)}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn('ml-4 h-6 w-6', !showText && 'ml-2')} />
                  {showText && item.name}
                </div>
                {showText && (
                  <ChevronDown
                    className={cn(
                      'mr-4 h-4 w-4 transition-transform duration-200',
                      isExpanded && 'rotate-180 transform'
                    )}
                  />
                )}
              </div>
            ) : (
              <Link href={item.href}>
                <div
                  className={cn(
                    linkClassName,
                    'flex cursor-pointer items-center justify-between',
                    isPathActive(item.href) &&
                      'border border-white bg-neutral-200/10'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn('ml-4 h-6 w-6', !showText && 'ml-2')} />
                    {showText && item.name}
                  </div>
                </div>
              </Link>
            )}

            {hasSubItems && showText && (
              <div
                className={cn(
                  'flex flex-col overflow-hidden pl-8 transition-all duration-200',
                  isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                {item.subItems?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      'mt-2 rounded-md px-4 py-2 text-white transition-colors hover:bg-neutral-200/10',
                      isPathActive(subItem.href) && 'bg-neutral-200/10'
                    )}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavItem;
