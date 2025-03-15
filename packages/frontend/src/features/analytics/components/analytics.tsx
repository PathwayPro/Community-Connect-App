'use client';

import { Button } from '@/shared/components/ui/button';
import { MentorshipSection } from '@/features/mentorship/components/common/mentorship-section';
import { useUserStore } from '@/features/user-profile/store';
import MentorCard from '@/features/mentorship/components/common/mentor-card';
import { AnalyticsSelect } from './common/analytics-select';
import { DownloadIcon } from 'lucide-react';
import { PieChartCard } from './common/pie-chart-card';
import { UserActivity } from './user-activity';
import { ChartCard } from './common/chart-card';

export const selectOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
];

const data = [
  { month: 'Jan', value: 30 },
  { month: 'Feb', value: 40 },
  { month: 'Mar', value: 65 },
  { month: 'Apr', value: 35 },
  { month: 'May', value: 45 },
  { month: 'Jun', value: 55 },
  { month: 'Jul', value: 40 }
];
export const Analytics = () => {
  const { user } = useUserStore();

  return (
    <div className="container-wide flex w-full flex-col gap-6">
      <MentorshipSection className="h-auto w-full">
        <MentorshipSection.Header>
          <h6 className="font-semibold">Hey, {user?.firstName}!👋</h6>
          <div className="flex items-center justify-end gap-4">
            <Button className="h-10 w-fit px-4">
              <DownloadIcon className="h-6 w-6" />
              Download Report
            </Button>
            <Button className="h-10 w-fit px-4">
              <DownloadIcon className="h-6 w-6" />
              Download User Data
            </Button>
          </div>
        </MentorshipSection.Header>

        <MentorshipSection.Content className="w-full">
          <div className="flex w-full gap-4">
            <div className="flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-neutral-light-200 p-4">
              <div className="flex w-full items-center justify-between gap-4">
                <h6 className="font-semibold">Overview</h6>
                <AnalyticsSelect
                  options={selectOptions}
                  placeholder="Select a period"
                />
              </div>
              <div className="flex flex-col gap-6">
                <MentorCard
                  title="Total Users"
                  value="1893"
                  icon="minutesMentored"
                  trend="arrowTrendingUp"
                  trendValue="25%"
                  trendText="Up from last month"
                  trendUp={true}
                  className="bg-white"
                  iconFrameClassName="bg-primary-300"
                  iconClassName="stroke-white"
                />
                <MentorCard
                  title="Engagement Rate"
                  value="15%"
                  icon="mentees"
                  trend="arrowTrendingDown"
                  trendValue="2.5%"
                  trendText="Down from last month"
                  trendUp={false}
                  className="bg-white"
                  iconFrameClassName="bg-primary-300"
                  iconClassName="stroke-white"
                />
              </div>
            </div>

            <div className="mh-full flex w-full flex-col justify-between rounded-2xl border-2 border-gray-200 bg-neutral-light-200 p-4">
              <div className="flex w-full items-center justify-between gap-4">
                <h6 className="font-semibold">New Users</h6>
                <AnalyticsSelect
                  options={selectOptions}
                  placeholder="Select a period"
                />
              </div>
              <div className="mt-4 flex h-full w-full">
                <ChartCard
                  data={data}
                  title="Monthly Analytics"
                  currentValue={1245}
                />
              </div>
            </div>
          </div>
        </MentorshipSection.Content>
      </MentorshipSection>
      <MentorshipSection className="h-auto w-full">
        <div className="flex w-full gap-4">
          <div className="flex w-1/3 flex-col gap-4">
            <div className="flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-neutral-light-200 p-4">
              <MentorshipSection.Header>
                <div className="flex w-full items-center justify-between gap-4">
                  <h6 className="font-semibold">User Distribution</h6>
                  <AnalyticsSelect
                    options={selectOptions}
                    placeholder="Select a period"
                  />
                </div>
              </MentorshipSection.Header>

              <MentorshipSection.Content>
                <PieChartCard
                  data={[
                    {
                      name: 'Active Users',
                      value: 65,
                      color: '#364983'
                    },
                    {
                      name: 'Inactive Users',
                      value: 35,
                      color: '#AFB6CD'
                    }
                  ]}
                  showPercentage={true}
                  title="Total Users"
                  onDownload={() => {}}
                />
              </MentorshipSection.Content>
            </div>
          </div>
          <UserActivity />
        </div>
      </MentorshipSection>
    </div>
  );
};
