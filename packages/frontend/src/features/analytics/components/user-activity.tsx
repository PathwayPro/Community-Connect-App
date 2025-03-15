import { MentorshipSection } from '@/features/mentorship/components/common/mentorship-section';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import { AnalyticsSelect } from './common/analytics-select';
import { selectOptions } from './analytics';

export const UserActivity = () => {
  return (
    <div className="flex w-2/3 flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-neutral-light-200 p-4">
      <MentorshipSection.Header>
        <div className="flex w-full items-center justify-between gap-4">
          <h6 className="font-semibold">User Activity</h6>
          <AnalyticsSelect
            options={selectOptions}
            placeholder="Select a period"
          />
        </div>
      </MentorshipSection.Header>
      <MentorshipSection.Content>
        <Tabs defaultValue="mentors">
          <TabsList className="flex w-full items-center justify-start">
            <TabsTrigger value="networking" className="w-fit px-4">
              Networking
            </TabsTrigger>
            <TabsTrigger value="features" className="w-fit px-4">
              Features
            </TabsTrigger>
            <TabsTrigger value="resources" className="w-fit px-4">
              Resources
            </TabsTrigger>
            <TabsTrigger value="events" className="w-fit px-4">
              Events
            </TabsTrigger>
          </TabsList>
          <TabsContent value="networking" className="mt-4">
            <div className="flex min-h-full w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4">
              <h6 className="font-semibold">Networking</h6>
            </div>
          </TabsContent>
          <TabsContent value="features" className="mt-4">
            <div className="flex h-full w-full flex-col gap-4">
              <div className="flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4">
                <h6 className="font-semibold">Features</h6>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="resources" className="mt-4">
            <div className="flex h-full w-full flex-col gap-4">
              <div className="flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4">
                <h6 className="font-semibold">Resources</h6>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <div className="flex h-full w-full flex-col gap-4">
              <div className="flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4">
                <h6 className="font-semibold">Events</h6>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </MentorshipSection.Content>
    </div>
  );
};
