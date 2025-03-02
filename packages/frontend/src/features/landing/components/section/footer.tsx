import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Facebook, Instagram } from 'lucide-react';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <Link
    href={href}
    className="text-gray-600 transition-colors hover:text-gray-900"
  >
    {children}
  </Link>
);

export function FooterSection() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Logo and Social Links */}
          <div className="space-y-6">
            <Image
              src="/images/logo.png"
              alt="CommunNet Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
            <div className="flex space-x-4">
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
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <div className="space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/membership">Apply for membership</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
            </div>
          </div>

          {/* Work with Us Links */}
          <div>
            <h3 className="mb-4 font-semibold">Work with Us</h3>
            <div className="space-y-3">
              <FooterLink href="/member">Become a member</FooterLink>
              <FooterLink href="/volunteer">Become a volunteer</FooterLink>
              <FooterLink href="/partner">Become a partner</FooterLink>
            </div>
          </div>

          {/* Events Links */}
          <div>
            <h3 className="mb-4 font-semibold">Events</h3>
            <div className="space-y-3">
              <FooterLink href="/events/upcoming">Upcoming Events</FooterLink>
              <FooterLink href="/events/past">Past Events</FooterLink>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
