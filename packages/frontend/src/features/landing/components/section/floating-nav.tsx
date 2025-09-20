'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { SharedIcons } from '@/shared/components/icons';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Mentorship', href: '#mentorship' },
  { label: 'Contact Us', href: '#contact' }
];

export function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Update active hash on mount and hash change
    const updateActiveHash = () => {
      setActiveHash(window.location.hash);
    };

    // Set initial hash
    updateActiveHash();

    // Listen for hash changes
    window.addEventListener('hashchange', updateActiveHash);
    return () => window.removeEventListener('hashchange', updateActiveHash);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    // Prevent default behavior
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      // Smooth scroll to element
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL and trigger hashchange after scrolling
      window.history.pushState(null, '', href);
      window.dispatchEvent(new HashChangeEvent('hashchange'));

      // Close mobile menu if open
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed left-1/2 top-4 z-40 flex h-[70px] w-full max-w-screen-xl -translate-x-1/2 items-center justify-between rounded-2xl border border-[#C3D0FF] bg-[#E8EDFFBF] px-4 py-2 transition-all duration-300 md:px-6',
          isScrolled ? 'shadow-lg backdrop-blur-md' : ''
        )}
      >
        {/* Logo */}
        <Link href="#home" className="flex items-center gap-2">
          <SharedIcons.logo className="h-8 w-8" />
          <span className="text-lg font-bold text-primary">CommuNet</span>
        </Link>

        {/* Navigation Links (desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className={cn(
                'px-2 text-base font-medium text-primary hover:border-b hover:border-primary',
                item.href === activeHash ? 'border-b border-primary' : ''
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
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

        {/* Hamburger (mobile) */}
        <button
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-primary md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 flex w-4/5 max-w-xs flex-col gap-4 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link
                href="#home"
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#home');
                }}
              >
                <SharedIcons.logo className="h-7 w-7" />
                <span className="text-base font-bold text-primary">
                  CommuNet
                </span>
              </Link>
              <button
                aria-label="Close menu"
                className="rounded-md p-2 text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-2 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={cn(
                    'rounded-md px-2 py-3 text-base font-medium',
                    item.href === activeHash
                      ? 'bg-primary/10 text-primary'
                      : 'text-primary hover:bg-primary/5'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2">
              <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="h-10 w-full bg-primary px-4 hover:bg-primary-500">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="h-10 w-full bg-[#E8EDFFBF] px-4 text-primary hover:bg-primary/10"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
