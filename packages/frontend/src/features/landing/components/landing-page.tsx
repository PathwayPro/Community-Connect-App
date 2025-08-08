'use client';

import { useState, useEffect } from 'react';
import {
  AboutSection,
  FeaturesSection,
  ForumSection,
  HeroSection,
  MentorSection,
  MissionSection,
  PartnersSection
} from './section';

export const LandingPage = () => {
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Set initial hash
    setHash(window.location.hash);

    // Listen for hash changes
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <main className="relative min-h-screen w-full px-0">
      <div className={hash === '#about' ? 'block' : 'hidden'}>
        <AboutSection />
        <MissionSection />
      </div>
      <div className={hash === '#about' ? 'hidden' : 'block'}>
        <HeroSection />
        <PartnersSection />
        <FeaturesSection />
        <ForumSection />
        <MentorSection />
      </div>
    </main>
  );
};
