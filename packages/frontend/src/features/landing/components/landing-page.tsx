import { FloatingNav } from '@/features/landing/components/section/floating-nav';
import { HeroSection } from '@/features/landing/components/section/hero-section';
import { FeaturesSection } from '@/features/landing/components/section/features-section';
import { PartnersSection } from '@/features/landing/components/section/partners';
import { ForumSection } from '@/features/landing/components/section/forum-section';
import { MentorSection } from '@/features/landing/components/section/mentor-section';
import { ContactSection } from '@/features/landing/components/section/contact-section';
import { NewsletterSection } from '@/features/landing/components/section/newsletter';
import { FooterSection } from '@/features/landing/components/section/footer';

export const LandingPage = () => {
  return (
    <main className="container-wide relative min-h-screen px-0">
      <FloatingNav />
      <HeroSection />
      <PartnersSection />
      <FeaturesSection />
      <ForumSection />
      <MentorSection />
      <ContactSection />
      <NewsletterSection />
      <FooterSection />
    </main>
  );
};
