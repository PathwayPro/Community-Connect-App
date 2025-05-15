import Link from 'next/link';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import { Icons } from '@/features/auth/components';
import { Separator } from '@/shared/components/ui/separator';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle hash links
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        // Smooth scroll to element
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL and trigger hashchange
        window.history.pushState(null, '', href);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    }
  };

  return (
    <Link
      href={href}
      className="text-neutral-dark-100 transition-colors hover:text-gray-900"
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export function FooterSection() {
  return (
    <footer className="border-t bg-[#E9EEFF]">
      <div className="flex justify-between px-16 py-8">
        {/* Logo and Social Links */}
        <div className="space-y-4">
          <Link href="#home" className="flex items-center gap-2">
            <Icons.logo className="h-16 w-16" />
            <h5 className="text-2xl font-semibold text-primary-500">
              CommuNet
            </h5>
          </Link>
          <div className="flex flex-col">
            <p className="text-sm text-neutral-dark-100">
              Connecting communities through technology
            </p>
          </div>
          <div className="flex space-x-4 pt-6">
            <FooterLink href="https://linkedin.com">
              <Linkedin className="h-5 w-5" />
            </FooterLink>
            <FooterLink href="https://facebook.com">
              <Facebook className="h-5 w-5" />
            </FooterLink>
            <FooterLink href="https://instagram.com">
              <Instagram className="h-5 w-5" />
            </FooterLink>
          </div>
        </div>

        {/* Company Links */}
        <div className="flex gap-4">
          <div className="flex flex-col">
            <h6 className="mb-4 font-semibold text-primary-500">Company</h6>
            <div className="flex flex-col gap-2">
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#contact">Contact Us</FooterLink>
              <FooterLink href="#mentorship">Apply for mentorship</FooterLink>
            </div>
          </div>

          {/* Work with Us Links */}
          <div>
            <h6 className="mb-4 font-semibold text-primary-500">
              Work with Us
            </h6>
            <div className="flex flex-col gap-2">
              <FooterLink href="/contact-us">Become a member</FooterLink>
              <FooterLink href="/contact-us">Become a volunteer</FooterLink>
              <FooterLink href="/contact-us">Become a partner</FooterLink>
            </div>
          </div>

          {/* Events Links */}
          <div>
            <h6 className="mb-4 font-semibold text-primary-500">Events</h6>
            <div className="flex flex-col gap-2">
              <FooterLink href="/events">Upcoming Events</FooterLink>
              <FooterLink href="/events">Past Events</FooterLink>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2 border-[0.5px] border-[#C3D0FF]" />

      {/* Copyright */}
      <div className="px-16 py-4">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} CommuNet. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
