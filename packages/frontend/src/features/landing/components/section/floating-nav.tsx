'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { SharedIcons } from '@/shared/components/icons';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Features', href: '#features' }
];

export function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed left-1/2 top-4 z-50 flex h-[70px] w-full max-w-screen-xl -translate-x-1/2 items-center justify-between rounded-2xl border border-[#C3D0FF] bg-[#E8EDFFBF] px-6 py-2 transition-all duration-300',
        isScrolled ? 'shadow-lg backdrop-blur-md' : ''
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <SharedIcons.logo className="h-8 w-8" />
        <span className="text-lg font-bold text-primary">CommuNet</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="px-2 text-base font-medium text-primary hover:border-b hover:border-primary"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link href="/auth/register">
          <Button className="h-10 bg-primary px-4 hover:bg-primary-500">
            Get Started
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button
            variant="outline"
            className="h-10 bg-[#E8EDFFBF] px-4 text-primary hover:bg-primary/10"
          >
            Login
          </Button>
        </Link>
      </div>
    </nav>
  );
}
