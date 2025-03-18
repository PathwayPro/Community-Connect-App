'use client';
import {
  ContactSection,
  FloatingNav,
  FooterSection,
  NewsletterSection
} from '@/features/landing/components/section';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="flex w-full flex-col">
      <FloatingNav />
      {children}
      <ContactSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default LandingLayout;
