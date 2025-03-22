'use client';

import { EventDetails } from '@/features/events/components/event-details';

interface EventPageProps {
  eventId: string;
}

export default function EventPage({ eventId }: EventPageProps) {
  return (
    <EventDetails
      eventId={eventId}
      onBack={() => window.history.back()}
      onShare={() => console.log('Share clicked')}
      onFavorite={() => console.log('Favorite clicked')}
      onRegister={() => console.log('Register clicked')}
      onConnect={() => console.log('Connect clicked')}
      onFollow={() => console.log('Follow clicked')}
    />
  );
}
