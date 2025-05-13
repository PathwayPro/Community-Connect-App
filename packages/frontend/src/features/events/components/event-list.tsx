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
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useRole } from '@/features/user-profile/hooks/useRole';
import { useUserStore } from '@/features/user-profile/store';

export const EventList = () => {
  const router = useRouter();
  const { events, fetchEvents, isLoading } = useEventStore();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const { hasPermission } = useRole();
  const { isLoading: isUserLoading } = useUserStore();

  // Check if user can create events (only admin and mentors)
  const canCreateEvent = !isUserLoading && hasPermission('create:event');

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
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  const upcomingEvents = getPageEvents(sortedEvents.slice(0, 1));
  const thisMonthEvents = getPageEvents(sortedEvents.slice(1, 4));
  const thisYearEvents = getPageEvents(sortedEvents.slice(4, 7));
  const allEvents = getPageEvents(sortedEvents);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log('events', events);

  if (isLoading) {
    return (
      <div className="container space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center justify-start gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-[400px] rounded-lg" />
              </div>
              <Skeleton className="h-10 w-[236px] rounded-lg" />
            </div>

            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="rounded-lg border p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-[200px]" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                      <Skeleton className="h-4 w-[300px]" />
                    </div>
                    <Skeleton className="h-10 w-[120px] rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderEventsList = (eventsList: Event[], totalEvents: Event[]) => {
    if (eventsList.length === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <EmptyStateCard
            title="No events found"
            description="There are no events for this time period"
            icon={Ticket}
            action={{
              label: 'Create New Event',
              onClick: () => router.push('/events/create')
            }}
          />
        </div>
      );
    }

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
            {canCreateEvent && (
              <IconButton
                leftIcon="plusCircle"
                label="Create New Event"
                className="w-[236px] bg-secondary-500"
                onClick={() => router.push('/events/create')}
              />
            )}
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
