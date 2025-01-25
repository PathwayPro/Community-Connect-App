'use client';

import { Button } from '@/shared/components/ui/button';
import {
  PlusCircleIcon,
  UserRoundPlus,
  MessageSquare,
  FileText,
  User
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import { useUserStore } from '@/features/user-profile/store';
import { useMentorshipStore } from '@/features/mentorship/store';
import MentorshipCard from './common/mentorship-card';
import { MentorshipSection } from './common/mentorship-section';
import { MentorshipIcons } from './icons';
import { DataTable } from './table/data-table';
import { sessionsColumns } from './table/sessions-columns';
import { menteesData } from './table/data';
import { menteesColumns } from './table/mentees-column';
import { useRouter } from 'next/navigation';

const MentorshipDashboard = () => {
  const { user } = useUserStore();
  const { mentor } = useMentorshipStore();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <MentorshipSection>
        <MentorshipSection.Header>
          <h6 className="font-semibold">Hey, {user?.firstName}!👋</h6>
          <div className="flex items-center gap-4">
            <Button className="h-10">
              <PlusCircleIcon className="h-4 w-4" /> Create a Session
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-10">
                  <UserRoundPlus className="h-4 w-4" /> View Profile
                </Button>
              </DialogTrigger>
              <DialogHeader>
                <DialogTitle className="sr-only">Mentor Profile</DialogTitle>
                <DialogDescription className="sr-only">
                  View your profile and update your information
                </DialogDescription>
              </DialogHeader>
              <DialogContent className="min-w-[1000px] p-12">
                <div className="flex flex-col gap-6 py-4">
                  {/* <div className="flex flex-col gap-2"> */}
                  <h5 className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h5>
                  {/* </div> */}
                  <div className="flex gap-2">
                    <p className="text-paragraph-lg font-semibold">Email :</p>
                    <p className="font-normal">{user?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-paragraph-lg font-semibold">
                      Field of Expertise :
                    </p>
                    <p className="font-normal">{user?.profession}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-paragraph-lg font-semibold">
                      Years of Experience :
                    </p>
                    <p className="font-normal">{user?.experience}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-paragraph-lg font-semibold">
                      Why you want to be a Mentor :
                    </p>
                    <p className="font-normal">{mentor?.experience_details}</p>
                  </div>
                </div>
                <div className="flex justify-start gap-4 pt-4">
                  <Button className="w-[180px]">
                    <MessageSquare className="mr-1 h-5 w-5" />
                    Message
                  </Button>
                  <Button className="w-[180px]" variant="outline">
                    <FileText className="mr-1 h-5 w-5" />
                    View Resume
                  </Button>
                  <Button
                    className="w-[180px]"
                    variant="outline"
                    onClick={() => router.push(`/profile`)}
                  >
                    <User className="mr-1 h-5 w-5" />
                    View Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </MentorshipSection.Header>
        <MentorshipSection.Content>
          <div className="flex gap-4">
            <MentorshipCard
              title="Minutes Mentored"
              value="1893"
              icon="minutesMentored"
              trend="arrowTrendingUp"
              trendValue="25%"
              trendText="Up from last month"
              trendUp={true}
            />
            <MentorshipCard
              title="Mentees"
              value="15"
              icon="mentees"
              trend="arrowTrendingDown"
              trendValue="2.5%"
              trendText="Down from last month"
              trendUp={false}
            />
            <MentorshipCard
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

export default MentorshipDashboard;
