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
  const {
    events,
    fetchEvents,
    isLoading: eventsLoading,
    eventSubscriptions,
    fetchEventSubscriptions
  } = useEventStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const eventsPerPage = 5;
  const { hasPermission } = useRole();
  const { user, isLoading: isUserLoading } = useUserStore();

  // Check if user can create events (only admin and mentors)
  const canCreateEvent = !isUserLoading && hasPermission('create:event');

  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    const fetchSubscribers = async () => {
      try {
        await fetchEvents();
        await fetchEventSubscriptions({
          user_id: Number(user?.id)
        });
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, [fetchEvents, fetchEventSubscriptions, user?.id]);

  console.log('eventSubscriptions', eventSubscriptions);

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

  // Get current date for upcoming events filtering
  const currentDate = new Date();

  // Filter for upcoming events (events that haven't happened yet)
  const upcomingEventsList = sortedEvents.filter(
    (event) => new Date(event.start_date) >= currentDate
  );

  // Filter for user's events (events they created or are participating in)
  const myEventsList = user?.id
    ? [
        ...sortedEvents.filter((event) => event.host_id === user.id),
        ...sortedEvents.filter((event) =>
          eventSubscriptions.some(
            (subscription) =>
              subscription.user.id === user.id &&
              subscription.event.id === event.id
          )
        )
      ]
    : [];

  // Get paginated event lists for each tab
  const allEvents = getPageEvents(sortedEvents);
  const upcomingEvents = getPageEvents(upcomingEventsList);
  const myEvents = getPageEvents(myEventsList);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log('events', events);

  if (isLoading || eventsLoading) {
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
        <Tabs defaultValue="all" className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center justify-start gap-4">
              <span className="text-sm text-neutral-dark-300">
                Sort Events By:
              </span>
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="my-events">My Events</TabsTrigger>
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
            value="all"
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
              renderEventsList(allEvents, sortedEvents)
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="flex w-full flex-col gap-6">
            {renderEventsList(upcomingEvents, upcomingEventsList)}
          </TabsContent>

          <TabsContent value="my-events" className="flex w-full flex-col gap-6">
            {renderEventsList(myEvents, myEventsList)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
