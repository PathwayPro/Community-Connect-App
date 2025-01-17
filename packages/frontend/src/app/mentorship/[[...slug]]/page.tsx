import MentorshipDashboard from '@/features/mentorship/components/mentorship-dashboard';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MentorForm from '@/features/mentorship/components/mentor-form';
import MenteeForm from '@/features/mentorship/components/mentee-form';
import MentorshipApply from '@/features/mentorship/components/mentorship-apply';

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
          <MentorshipDashboard />
        </div>
      );
    }

    // Handle first level routes
    switch (params.slug[0]) {
      case 'dashboard':
        return <MentorshipDashboard />;

      case 'apply':
        // Handle apply subroutes for mentor/mentee
        if (params.slug[1]) {
          switch (params.slug[1]) {
            case 'mentor':
              return <MentorForm />;
            case 'mentee':
              return <MenteeForm />;
            default:
              notFound();
          }
        }
        return <MentorshipApply />;

      default:
        notFound();
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>{renderContent()}</Suspense>
  );
}