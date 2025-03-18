'use client';

import { EventDetails } from '@/features/events/components/event-details';

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  return (
    <EventDetails
      eventId={params.eventId}
      onBack={() => window.history.back()}
      onShare={() => console.log('Share clicked')}
      onFavorite={() => console.log('Favorite clicked')}
      onRegister={() => console.log('Register clicked')}
      onConnect={() => console.log('Connect clicked')}
      onFollow={() => console.log('Follow clicked')}
    />
  );
}
