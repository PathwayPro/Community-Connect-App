'use client';

import { Button } from '@/shared/components/ui/button';
import { PlusCircleIcon, UserRoundPlus } from 'lucide-react';
import { useUserStore } from '@/features/user-profile/store';
import { MentorshipSection } from './common/mentorship-section';
import { MentorshipIcons } from './icons';
import { DataTable } from './table/data-table';
import { sessionsColumns } from './table/sessions-columns';
import { menteesColumns } from './table/mentees-column';
import MentorCard from './common/mentor-card';
import { useState, useEffect } from 'react';
import { MentorModal } from './common/modals/mentor-modal';
import { useMentorshipStore } from '../store';
import { MenteeStatus } from '../types';

interface ProfileData {
  firstName: string;
  lastName: string;
  profession: string;
  email: string;
  avatarUrl: string;
  isMentor: boolean;
  company?: string;
  expertise?: string;
}

const MentorDashboard = () => {
  const { user } = useUserStore();
  const {
    // mentorDashboard,
    mentorStatistics,
    mentorUpcomingSessions,
    mentorMentees,
    getMyDashboard,
    getMyStatistics,
    getMyUpcomingSessions,
    getMyMentees,
    isLoading,
    error
  } = useMentorshipStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(
    null
  );

  useEffect(() => {
    // Fetch all dashboard data when component mounts
    const fetchDashboardData = async () => {
      try {
        await Promise.all([
          getMyDashboard(),
          getMyStatistics(),
          getMyUpcomingSessions(),
          getMyMentees()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [getMyDashboard, getMyStatistics, getMyUpcomingSessions, getMyMentees]);

  const mentorData: ProfileData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profession: user?.profession || '',
    company: user?.companyName,
    expertise: user?.profession,
    email: user?.email || '',
    avatarUrl: '/profile/profile.png',
    isMentor: true
  };

  const handleViewProfile = () => {
    setSelectedProfile(mentorData);
    setIsModalOpen(true);
  };

  // Transform upcoming sessions data for the table
  const upcomingSessionsData = mentorUpcomingSessions.map((session) => ({
    id: session.id,
    date: session.lastMet || new Date().toISOString(), // Add date
    identity: {
      firstName: session.mentee.split(' ')[0] || '',
      lastName: session.mentee.split(' ').slice(1).join(' ') || '',
      email: '',
      avatar: session.avatar || '/profile/default-avatar.png'
    },
    link: session.link,
    profession: session.profession || 'Not specified',
    lastSession: session.lastMet
      ? new Date(session.lastMet).toLocaleDateString()
      : 'Never',
    nextSession: session.link ? 'Scheduled' : 'Not scheduled'
  }));

  // Transform mentees data for the table
  const menteesTableData = mentorMentees.map((mentee, index) => ({
    id: mentee.id,
    menteeApplicationId: index,
    identity: {
      avatar: mentee.avatar || '/profile/default-avatar.png',
      firstName: mentee.mentee.split(' ')[0] || '',
      lastName: mentee.mentee.split(' ').slice(1).join(' ') || '',
      email: mentee.email
    },
    date: new Date().toISOString(),
    profession: mentee.profession || 'Not specified',
    status: mentee.status as MenteeStatus, // Cast to match MenteeStatus enum
    email: mentee.email,
    reason: '',
    experience: '',
    resume: ''
  }));

  if (isLoading) {
    return (
      <div className="container-wide flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-wide flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-red-600">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide flex flex-col gap-6 px-4 md:px-0">
      <MentorshipSection>
        <MentorshipSection.Header>
          <h6 className="font-semibold">Hey, {user?.firstName}!👋</h6>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button className="h-10 w-full sm:w-auto">
              <PlusCircleIcon className="h-4 w-4" /> Create a Session
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full sm:w-fit"
              onClick={handleViewProfile}
            >
              <UserRoundPlus className="h-4 w-4" /> View Profile
            </Button>
            <MentorModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              profileData={selectedProfile}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </MentorshipSection.Header>

        <MentorshipSection.Content>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MentorCard
              title="Minutes Mentored"
              value={mentorStatistics?.minutesMentored?.toString() || '0'}
              icon="minutesMentored"
              trend="arrowTrendingUp"
              trendValue={`${mentorStatistics?.minutesMentoredDiff?.toFixed(1)}%`}
              trendText={
                (mentorStatistics?.minutesMentoredDiff || 0) >= 0
                  ? 'Up from last month'
                  : 'Down from last month'
              }
              trendUp={(mentorStatistics?.minutesMentoredDiff || 0) >= 0}
            />
            <MentorCard
              title="Mentees"
              value={mentorStatistics?.mentees?.toString() || '0'}
              icon="mentees"
              trend="arrowTrendingDown"
              trendValue={`${mentorStatistics?.menteesDiff?.toFixed(1)}%`}
              trendText={
                (mentorStatistics?.menteesDiff || 0) >= 0
                  ? 'Up from last month'
                  : 'Down from last month'
              }
              trendUp={(mentorStatistics?.menteesDiff || 0) >= 0}
            />
            <MentorCard
              title="Live Sessions"
              value={mentorStatistics?.liveSessions?.toString() || '0'}
              icon="liveSessions"
              trend="arrowTrendingDown"
              trendValue={`${mentorStatistics?.liveSessionsDiff?.toFixed(1)}%`}
              trendText={
                (mentorStatistics?.liveSessionsDiff || 0) >= 0
                  ? 'Up from last month'
                  : 'Down from last month'
              }
              trendUp={(mentorStatistics?.liveSessionsDiff || 0) >= 0}
            />
          </div>
        </MentorshipSection.Content>
      </MentorshipSection>

      <div className="flex flex-col gap-4 lg:flex-row">
        <MentorshipSection className="h-auto overflow-hidden lg:h-[444px]">
          <MentorshipSection.Header>
            <h6 className="font-semibold">Upcoming Sessions</h6>
            <Button className="h-10 w-full sm:w-auto">View All</Button>
          </MentorshipSection.Header>
          <MentorshipSection.Content>
            <DataTable columns={sessionsColumns} data={upcomingSessionsData} />
          </MentorshipSection.Content>
        </MentorshipSection>
        <MentorshipSection className="h-auto overflow-hidden lg:h-[444px]">
          <MentorshipSection.Header>
            <div className="flex items-center gap-4">
              <h6 className="font-semibold">My Mentees</h6>
              <div className="flex items-center gap-1">
                <MentorshipIcons.mentees className="h-9 w-9" />
                <h6 className="font-medium">
                  {mentorStatistics?.mentees || 0}
                </h6>
              </div>
            </div>
            <Button className="h-10 w-full sm:w-auto">View All</Button>
          </MentorshipSection.Header>
          <MentorshipSection.Content>
            <DataTable
              columns={menteesColumns}
              data={menteesTableData}
              onRowClick={(rowData) => {
                setSelectedProfile({
                  firstName: rowData.identity.firstName,
                  lastName: rowData.identity.lastName,
                  profession: rowData.profession,
                  email: rowData.identity.email,
                  avatarUrl: rowData.identity.avatar,
                  isMentor: false
                });
                setIsModalOpen(true);
              }}
            />
          </MentorshipSection.Content>
        </MentorshipSection>
      </div>
    </div>
  );
};

export default MentorDashboard;
