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

// Add an interface for event data
interface EventData {
  id: string;
  title: string;
  description: string;
  address: string;
  time: string;
  date: string;
  imageUrl: string;
  eventType: string;
  host: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
  tags: string[];
}

// Sample events data array
export const sampleEvents: EventData[] = [
  {
    id: '1',
    title: 'Team Building Workshop',
    description:
      'Join us for an interactive workshop focused on team collaboration and leadership skills. Activities include problem-solving challenges and trust-building exercises.',
    address: 'Innovation Hub, 123 Tech Street, Vancouver, BC',
    time: '2:00 PM',
    date: 'Tomorrow',
    imageUrl: '/event/placeholder-4.jpg',
    eventType: 'Workshop',
    host: {
      name: 'Sarah Chen',
      bio: 'Leadership Development Coach',
      avatarUrl: '/profile/msnice.png'
    },
    tags: ['team-building', 'leadership', 'professional-development']
  },
  {
    id: '2',
    title: 'Monthly Planning',
    description:
      'Strategic planning session for Q2 2024. Review of KPIs, goal setting, and resource allocation discussion for upcoming projects.',
    address: 'Virtual Event - Zoom',
    time: '1:00 PM',
    date: 'March 25, 2024',
    imageUrl: '/event/placeholder-3.jpg',
    eventType: 'Meeting',
    host: {
      name: 'Michael Rodriguez',
      bio: 'Project Manager',
      avatarUrl: '/profile/mrnice.png'
    },
    tags: ['planning', 'strategy', 'business']
  },
  {
    id: '3',
    title: 'Design Workshop',
    description:
      'Hands-on workshop covering the latest UI/UX trends, design systems, and prototyping tools. Perfect for designers of all levels.',
    address: 'Creative Hub, 456 Design Avenue, Toronto, ON',
    time: '2:30 PM',
    date: 'March 28, 2024',
    imageUrl: '/event/placeholder-2.jpg',
    eventType: 'Workshop',
    host: {
      name: 'Emma Thompson',
      bio: 'Senior UX Designer',
      avatarUrl: '/profile/mrnobody.png'
    },
    tags: ['design', 'ui-ux', 'creative', 'workshop']
  },
  {
    id: '4',
    title: 'Team Meetup',
    description:
      'Casual networking event with refreshments. Meet your colleagues from different departments and share experiences in a relaxed atmosphere.',
    address: 'The Gathering Spot, 789 Social Lane, Montreal, QC',
    time: '5:00 PM',
    date: 'March 30, 2024',
    imageUrl: '/event/placeholder.jpg',
    eventType: 'Social',
    host: {
      name: 'David Park',
      bio: 'Community Manager',
      avatarUrl: '/profile/msnobody.png'
    },
    tags: ['networking', 'social', 'team-building']
  },
  {
    id: '5',
    title: 'Annual Conference',
    description:
      'Join industry pioneers for our flagship conference featuring keynote speakers, breakout sessions, and cutting-edge technology showcases. Early bird registration now open!',
    address: 'Vancouver Convention Centre, 1055 Canada Place, Vancouver, BC',
    time: '9:00 AM',
    date: 'July 15, 2024',
    imageUrl: '/event/placeholder-4.jpg',
    eventType: 'Conference',
    host: {
      name: 'Dr. Lisa Kumar',
      bio: 'Technology Director',
      avatarUrl: '/profile/mra.png'
    },
    tags: ['conference', 'technology', 'innovation', 'networking']
  },
  {
    id: '6',
    title: 'Summer Hackathon',
    description:
      '48-hour coding marathon where teams compete to build innovative solutions. Prizes worth $50,000, mentorship opportunities, and recruitment possibilities from top tech companies.',
    address: 'MaRS Discovery District, 101 College Street, Toronto, ON',
    time: '10:00 AM',
    date: 'August 1, 2024',
    imageUrl: '/event/placeholder-2.jpg',
    eventType: 'Hackathon',
    host: {
      name: 'Alex Rivera',
      bio: 'Lead Developer',
      avatarUrl: '/profile/msnobody.png'
    },
    tags: ['hackathon', 'coding', 'competition', 'tech']
  },
  {
    id: '7',
    title: 'Year-End Party',
    description:
      'Celebrate our achievements with an evening of entertainment, awards ceremony, dinner, and dancing. Special performances and surprise announcements planned.',
    address: 'Fairmont Royal York, 100 Front Street West, Toronto, ON',
    time: '6:00 PM',
    date: 'December 20, 2024',
    imageUrl: '/event/placeholder-3.jpg',
    eventType: 'Social',
    host: {
      name: 'Jennifer Walsh',
      bio: 'Events Director',
      avatarUrl: '/profile/profile.png'
    },
    tags: ['celebration', 'awards', 'party', 'year-end']
  }
];

export const EventList = () => {
  const router = useRouter();

  // Filter events based on tab
  const upcomingEvents = sampleEvents.slice(0, 1);
  const thisMonthEvents = sampleEvents.slice(1, 4);
  const thisYearEvents = sampleEvents.slice(4, 7);
  const allEvents = sampleEvents;

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
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </TabsContent>

          <TabsContent
            value="this-month"
            className="flex w-full flex-col gap-6"
          >
            {thisMonthEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </TabsContent>

          <TabsContent value="this-year" className="flex w-full flex-col gap-6">
            {thisYearEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </TabsContent>

          <TabsContent value="all" className="flex w-full flex-col gap-6">
            {allEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
