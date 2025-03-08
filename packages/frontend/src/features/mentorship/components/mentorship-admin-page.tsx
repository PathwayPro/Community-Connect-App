'use client';

import { useUserStore } from '@/features/user-profile/store';
import { MentorshipSection } from './common/mentorship-section';
import { DataTable } from './table/data-table';
import { mentorshipAdminColumns } from './table/mentoship-admin-columns';
import { mentorshipAdminData } from './table/data';
import MentorCard from './common/mentor-card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/shared/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';

export const MentorshipAdminPage = () => {
  const { user } = useUserStore();

  return (
    <div className="container-wide flex w-full flex-col gap-6">
      <MentorshipSection>
        <MentorshipSection.Header>
          <h6 className="font-semibold">Hey, {user?.firstName}!👋</h6>
        </MentorshipSection.Header>
        <MentorshipSection.Content>
          <div className="flex gap-4">
            <MentorCard
              title="Mentors"
              value="1893"
              icon="minutesMentored"
              trend="arrowTrendingUp"
              trendValue="25%"
              trendText="Up from last month"
              trendUp={true}
              iconFrameClassName="bg-primary-300"
              iconClassName="stroke-white"
            />
            <MentorCard
              title="Mentees"
              value="15"
              icon="mentees"
              trend="arrowTrendingDown"
              trendValue="2.5%"
              trendText="Down from last month"
              trendUp={false}
              iconFrameClassName="bg-primary-300"
              iconClassName="stroke-white"
            />
          </div>
        </MentorshipSection.Content>
      </MentorshipSection>
      <div className="flex h-full w-full gap-4">
        <MentorshipSection className="h-[444px]">
          <MentorshipSection.Header>
            <div className="flex w-full items-center justify-between">
              <h6 className="font-semibold">Mentors and Mentees</h6>
              <Select defaultValue="All">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </MentorshipSection.Header>
          <MentorshipSection.Content>
            <Tabs defaultValue="mentors">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="mentors" className="w-fit px-4">
                  Mentors
                </TabsTrigger>
                <TabsTrigger value="mentees" className="w-fit px-4">
                  Mentees
                </TabsTrigger>
              </TabsList>
              <TabsContent value="mentors">
                <DataTable
                  columns={mentorshipAdminColumns}
                  data={mentorshipAdminData}
                />
              </TabsContent>
              <TabsContent value="mentees">
                <DataTable
                  columns={mentorshipAdminColumns}
                  data={mentorshipAdminData}
                />
              </TabsContent>
            </Tabs>
          </MentorshipSection.Content>
        </MentorshipSection>
      </div>
    </div>
  );
};
