'use client';

import { EventDetails } from '@/features/events/components/event-details';
import { useRouter } from 'next/navigation';

export default function EventPage() {
  const router = useRouter();

  return (
    <>
      <EventDetails
        onBack={() => router.back()}
        onShare={() => console.log('Share clicked')}
        onFavorite={() => console.log('Favorite clicked')}
        onRegister={() => console.log('Register clicked')}
        onFollow={() => console.log('Follow clicked')}
      />
    </>
  );
}
