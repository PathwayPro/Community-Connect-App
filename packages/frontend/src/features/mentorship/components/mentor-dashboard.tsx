'use client';

import { Button } from '@/shared/components/ui/button';
import { PlusCircleIcon, UserRoundPlus } from 'lucide-react';
import { useUserStore } from '@/features/user-profile/store';
import { MentorshipSection } from './common/mentorship-section';
import { MentorshipIcons } from './icons';
import { DataTable } from './table/data-table';
import { sessionsColumns } from './table/sessions-columns';
import { menteesData } from './table/data';
import { menteesColumns } from './table/mentees-column';
import MentorCard from './common/mentor-card';
import { useState } from 'react';
import { MentorModal } from './common/modals/mentor-modal';
// import { useMentorshipStore } from '@/features/mentorship/store';

const MentorDashboard = () => {
  const { user } = useUserStore();
  // const { mentor } = useMentorshipStore();
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  const mentorData = {
    id: user?.id || 0,
    firstName: user?.firstName,
    lastName: user?.lastName,
    profession: user?.profession,
    company: user?.companyName,
    expertise: user?.profession,
    email: user?.email,
    avatarUrl: '/profile/profile.png'
  };

  return (
    <div className="flex flex-col gap-6">
      <MentorshipSection>
        <MentorshipSection.Header>
          <h6 className="font-semibold">Hey, {user?.firstName}!👋</h6>
          <div className="flex items-center gap-4">
            <Button className="h-10">
              <PlusCircleIcon className="h-4 w-4" /> Create a Session
            </Button>
            <Button
              variant="outline"
              className="h-10 w-fit"
              onClick={() => setIsMentorModalOpen(true)}
            >
              <UserRoundPlus className="h-4 w-4" /> View Profile
            </Button>
            <MentorModal
              isOpen={isMentorModalOpen}
              onClose={() => setIsMentorModalOpen(false)}
              mentorData={mentorData}
              setIsMentorModalOpen={setIsMentorModalOpen}
            />
          </div>
        </MentorshipSection.Header>
        <MentorshipSection.Content>
          <div className="flex gap-4">
            <MentorCard
              title="Minutes Mentored"
              value="1893"
              icon="minutesMentored"
              trend="arrowTrendingUp"
              trendValue="25%"
              trendText="Up from last month"
              trendUp={true}
            />
            <MentorCard
              title="Mentees"
              value="15"
              icon="mentees"
              trend="arrowTrendingDown"
              trendValue="2.5%"
              trendText="Down from last month"
              trendUp={false}
            />
            <MentorCard
              title="Live Sessions"
              value="64"
              icon="liveSessions"
              trend="arrowTrendingDown"
              trendValue="10%"
              trendText="Down from last month"
              trendUp={false}
            />
          </div>
        </MentorshipSection.Content>
      </MentorshipSection>
      <div className="flex h-full w-full gap-4">
        <MentorshipSection className="h-[444px]">
          <MentorshipSection.Header>
            <h6 className="font-semibold">Upcoming Sessions</h6>
            <Button className="h-10">View All</Button>
          </MentorshipSection.Header>
          <MentorshipSection.Content>
            <DataTable columns={sessionsColumns} data={menteesData} />
          </MentorshipSection.Content>
        </MentorshipSection>
        <MentorshipSection className="h-[444px]">
          <MentorshipSection.Header>
            <div className="flex items-center gap-4">
              <h6 className="font-semibold">My Meentees</h6>
              <div className="flex items-center gap-1">
                <MentorshipIcons.mentees className="h-9 w-9" />
                <h6 className="font-medium">12</h6>
              </div>
            </div>
            <Button className="h-10">View All</Button>
          </MentorshipSection.Header>
          <MentorshipSection.Content>
            <DataTable columns={menteesColumns} data={menteesData} />
          </MentorshipSection.Content>
        </MentorshipSection>
      </div>
    </div>
  );
};

export default MentorDashboard;
