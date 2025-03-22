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
import { useEventStore } from '../store';
import { useEffect, useState } from 'react';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { Ticket } from 'lucide-react';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import { Event } from '../types';

export const EventList = () => {
  const router = useRouter();
  const { events, fetchEvents } = useEventStore();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Pagination helpers
  const getPageEvents = (eventsList: Event[]) => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return eventsList.slice(startIndex, endIndex);
  };

  const getTotalPages = (eventsList: Event[]) => {
    return Math.ceil(eventsList.length / eventsPerPage);
  };

  // Filter events based on tab
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const upcomingEvents = getPageEvents(sortedEvents.slice(0, 1));
  const thisMonthEvents = getPageEvents(sortedEvents.slice(1, 4));
  const thisYearEvents = getPageEvents(sortedEvents.slice(4, 7));
  const allEvents = getPageEvents(sortedEvents);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log('events', events);

  const renderEventsList = (eventsList: Event[], totalEvents: Event[]) => {
    return (
      <>
        {eventsList.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
        {totalEvents.length > eventsPerPage && (
          <div className="mt-6">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={getTotalPages(totalEvents)}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </>
    );
  };

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

          <TabsContent
            value="upcoming"
            className="flex h-full w-full flex-col gap-6"
          >
            {events.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center">
                <EmptyStateCard
                  title="No events created yet"
                  description="Create a new event to get started"
                  icon={Ticket}
                  action={{
                    label: 'Create New Event',
                    onClick: () => router.push('/events/create')
                  }}
                />
              </div>
            ) : (
              renderEventsList(upcomingEvents, events)
            )}
          </TabsContent>

          <TabsContent
            value="this-month"
            className="flex w-full flex-col gap-6"
          >
            {renderEventsList(thisMonthEvents, events)}
          </TabsContent>

          <TabsContent value="this-year" className="flex w-full flex-col gap-6">
            {renderEventsList(thisYearEvents, events)}
          </TabsContent>

          <TabsContent value="all" className="flex w-full flex-col gap-6">
            {renderEventsList(allEvents, events)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
