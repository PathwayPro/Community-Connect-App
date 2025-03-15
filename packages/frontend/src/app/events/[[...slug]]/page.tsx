import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EventDetails, EventForm } from '@/features/events/components';
import { EventList } from '@/features/events/components';

interface EventPageProps {
  params: {
    slug?: string[];
  };
}

export default async function EventPage({ params }: EventPageProps) {
  // Handle different routes based on slug patterns
  const [action, id] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /events - Show all events
      return (
        <Suspense fallback={<EventsLoadingSkeleton />}>
          <div className="flex w-full justify-center">
            <EventList />
          </div>
        </Suspense>
      );

    case 'create':
      // Handle /events/create
      return (
        <Suspense fallback={<EventFormSkeleton />}>
          <div className="flex w-full justify-center">
            <EventForm />
          </div>
        </Suspense>
      );

    case 'edit':
      // Handle /events/edit/:id
      if (!id) return notFound();
      return (
        <Suspense fallback={<EventFormSkeleton />}>
          <div className="flex w-full justify-center">
            <EventForm />
          </div>
        </Suspense>
      );

    default:
      // Handle /events/:id - Show specific event
      if (action && !id) {
        return (
          <Suspense fallback={<EventDetailsSkeleton />}>
            <div className="flex w-full justify-center">
              <EventDetails eventId={action} />
            </div>
          </Suspense>
        );
      }
      return notFound();
  }
}

// Component implementations
function EventsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

function EventFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/4 animate-pulse rounded bg-gray-200" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

function EventDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="h-64 animate-pulse rounded bg-gray-200" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
