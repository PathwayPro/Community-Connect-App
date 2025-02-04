import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MentorForm from '@/features/mentorship/components/mentor-form';
import MenteeForm from '@/features/mentorship/components/mentee-form';
import MentorshipApply from '@/features/mentorship/components/mentorship-apply';
import { MentorshipWaitlist } from '@/features/mentorship/components/mentorship-waitlist';
import MentorDashboard from '@/features/mentorship/components/mentor-dashboard';
import MenteeDashboard from '@/features/mentorship/components/mentee-dashboard';

interface MentorshipPageProps {
  params: {
    slug?: string[];
  };
}

export default function MentorshipPage({ params }: MentorshipPageProps) {
  const renderContent = () => {
    // If no slug, render main mentorship page
    if (!params.slug?.length) {
      return (
        <div className="flex w-full justify-center">
          <MentorshipApply />
        </div>
      );
    }

    // Handle first level routes
    switch (params.slug[0]) {
      case 'mentor-dashboard':
        return <MentorDashboard />;

      case 'mentee-dashboard':
        return <MenteeDashboard />;

      case 'mentor':
        return <MentorForm />;

      case 'mentee':
        return <MenteeForm />;

      case 'waitlist':
        return (
          <MentorshipWaitlist
            applicationDate={new Date()}
            activityType="Mentor"
          />
        );

      default:
        notFound();
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>{renderContent()}</Suspense>
  );
}
