'use client';

import { Suspense, useEffect, useState } from 'react';
import MentorForm from '@/features/mentorship/components/mentor-form';
import MenteeForm from '@/features/mentorship/components/mentee-form';
import MentorshipApply from '@/features/mentorship/components/mentorship-apply';
import { MentorshipWaitlist } from '@/features/mentorship/components/mentorship-waitlist';
import MentorDashboard from '@/features/mentorship/components/mentor-dashboard';
import MenteeDashboard from '@/features/mentorship/components/mentee-dashboard';
import { MentorshipAdminPage } from '@/features/mentorship/components/mentorship-admin-page';
// import { MentorProfile } from '@/features/mentorship/components/mentor-profile';
import { useRole } from '@/features/user-profile/hooks/useRole';
import { mentorshipApi } from '@/features/mentorship/api/mentorship-api';
import { PendingApplicationResponse } from '@/features/mentorship/types';

interface MentorshipPageProps {
  params: {
    slug?: string[];
  };
}

export default function MentorshipPage({ params }: MentorshipPageProps) {
  const { role, hasRole } = useRole();
  const [pendingApplication, setPendingApplication] =
    useState<PendingApplicationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingApplication = async () => {
      if (role === 'USER') {
        try {
          const response = await mentorshipApi.getPendingApplications();
          setPendingApplication(response.data);
        } catch (error) {
          console.error('Error fetching pending application:', error);
          setPendingApplication(null);
        }
      }
      setLoading(false);
    };

    fetchPendingApplication();
  }, [role]);

  const renderContent = () => {
    // If loading, show loading state
    if (loading) {
      return <div>Loading...</div>;
    }

    // Role-based routing for main mentorship page
    if (role) {
      if (hasRole('ADMIN')) {
        return <MentorshipAdminPage />;
      }

      if (hasRole('MENTOR')) {
        return <MentorDashboard />;
      }

      if (hasRole('MENTEE')) {
        return <MenteeDashboard />;
      }

      if (hasRole('USER')) {
        if (pendingApplication) {
          return (
            <MentorshipWaitlist
              applicationDate={pendingApplication.created_at || null}
              activityType={pendingApplication.activityType || null}
              applicationStatus={pendingApplication.status || null}
            />
          );
        }
      }
    }

    // Application forms
    switch (params?.slug?.[0]) {
      case 'mentor':
        return <MentorForm />;

      case 'mentee':
        return <MenteeForm />;
    }

    // Fallback for unauthenticated users or unknown roles
    return <MentorshipApply />;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>{renderContent()}</Suspense>
  );
}
