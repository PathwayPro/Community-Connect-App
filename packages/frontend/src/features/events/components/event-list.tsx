'use client';

import { IconButton } from '@/shared/components/ui/icon-button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { EventCard } from './common/event-card';

export const EventList = () => {
  const router = useRouter();
  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center justify-start gap-4">
              <span className="text-sm text-neutral-dark-300">
                Sort Events By:
              </span>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="this-month">Later this month</TabsTrigger>
                <TabsTrigger value="this-year">Later this year</TabsTrigger>
                <TabsTrigger value="all">All Events</TabsTrigger>
              </TabsList>
            </div>
            <IconButton
              leftIcon="plusCircle"
              label="Create New Event"
              className="w-[236px] bg-secondary-500"
              onClick={() => router.push('/events/create')}
            />
          </div>

          <TabsContent value="upcoming" className="flex w-full flex-col gap-6">
            <EventCard
              title="Team Building Workshop"
              description="Join us for an interactive workshop focused on team collaboration and leadership skills. Activities include problem-solving challenges and trust-building exercises."
              address="Innovation Hub, 123 Tech Street, Vancouver, BC"
              time="2:00 PM"
              date="Tomorrow"
              imageUrl="/event/placeholder-4.jpg"
            />
            <EventCard
              title="Product Launch"
              description="Be the first to experience our revolutionary AI-powered platform. Live demonstrations, networking opportunities, and exclusive early-access offers available for attendees."
              address="Telus Convention Centre, Calgary, Alberta"
              time="10:00 AM"
              date="02/12/2025"
              imageUrl="/event/placeholder-2.jpg"
            />
            <EventCard
              title="Tech Conference"
              description="Annual tech summit featuring industry leaders, innovative startups, and hands-on workshops on AI, Cloud Computing, and Web3 technologies."
              address="Shaw Conference Centre, Edmonton, Alberta"
              time="9:00 AM"
              date="In 3 days"
              imageUrl="/event/placeholder.jpg"
            />
          </TabsContent>

          <TabsContent
            value="this-month"
            className="flex w-full flex-col gap-6"
          >
            <EventCard
              title="Monthly Planning"
              description="Strategic planning session for Q2 2024. Review of KPIs, goal setting, and resource allocation discussion for upcoming projects."
              address="Virtual Event - Zoom"
              time="1:00 PM"
              date="March 25, 2024"
              imageUrl="/event/placeholder-3.jpg"
            />
            <EventCard
              title="Design Workshop"
              description="Hands-on workshop covering the latest UI/UX trends, design systems, and prototyping tools. Perfect for designers of all levels."
              address="Creative Hub, 456 Design Avenue, Toronto, ON"
              time="2:30 PM"
              date="March 28, 2024"
              imageUrl="/event/placeholder-2.jpg"
            />
            <EventCard
              title="Team Meetup"
              description="Casual networking event with refreshments. Meet your colleagues from different departments and share experiences in a relaxed atmosphere."
              address="The Gathering Spot, 789 Social Lane, Montreal, QC"
              time="5:00 PM"
              date="March 30, 2024"
              imageUrl="/event/placeholder.jpg"
            />
          </TabsContent>

          <TabsContent value="this-year" className="flex w-full flex-col gap-6">
            <EventCard
              title="Annual Conference"
              description="Join industry pioneers for our flagship conference featuring keynote speakers, breakout sessions, and cutting-edge technology showcases. Early bird registration now open!"
              address="Vancouver Convention Centre, 1055 Canada Place, Vancouver, BC"
              time="9:00 AM"
              date="July 15, 2024"
              imageUrl="/event/placeholder-4.jpg"
            />
            <EventCard
              title="Summer Hackathon"
              description="48-hour coding marathon where teams compete to build innovative solutions. Prizes worth $50,000, mentorship opportunities, and recruitment possibilities from top tech companies."
              address="MaRS Discovery District, 101 College Street, Toronto, ON"
              time="10:00 AM"
              date="August 1, 2024"
              imageUrl="/event/placeholder-2.jpg"
            />
            <EventCard
              title="Year-End Party"
              description="Celebrate our achievements with an evening of entertainment, awards ceremony, dinner, and dancing. Special performances and surprise announcements planned."
              address="Fairmont Royal York, 100 Front Street West, Toronto, ON"
              time="6:00 PM"
              date="December 20, 2024"
              imageUrl="/event/placeholder-3.jpg"
            />
          </TabsContent>

          <TabsContent value="all" className="flex w-full flex-col gap-6">
            <EventCard
              title="Team Building Workshop"
              description="Interactive workshop focused on team collaboration and leadership skills. Perfect for teams looking to strengthen their bonds and improve communication."
              address="Innovation Hub, 123 Tech Street, Vancouver, BC"
              time="2:00 PM"
              date="Tomorrow"
              imageUrl="/event/placeholder-3.jpg"
            />
            <EventCard
              title="Monthly Planning"
              description="Strategic planning session for Q2 2024. Review of KPIs, goal setting, and resource allocation discussion for upcoming projects."
              address="Virtual Event - Zoom"
              time="1:00 PM"
              date="March 25, 2024"
              imageUrl="/event/placeholder-3.jpg"
            />
            <EventCard
              title="Annual Conference"
              description="Join industry pioneers for our flagship conference featuring keynote speakers, breakout sessions, and cutting-edge technology showcases."
              address="Vancouver Convention Centre, 1055 Canada Place, Vancouver, BC"
              time="9:00 AM"
              date="July 15, 2024"
              imageUrl="/event/placeholder.jpg"
            />
            <EventCard
              title="Year-End Party"
              description="Celebrate our achievements with an evening of entertainment, awards ceremony, dinner, and dancing. Special performances planned."
              address="Fairmont Royal York, 100 Front Street West, Toronto, ON"
              time="6:00 PM"
              date="December 20, 2024"
              imageUrl="/event/placeholder-2.jpg"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
