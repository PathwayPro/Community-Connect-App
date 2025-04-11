import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Messages } from '@/features/messages/components';

interface MessagesPageProps {
  params: {
    slug?: string[];
  };
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const [action] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /messages - Show all messages

      return (
        <Suspense fallback={<MessagesLoadingSkeleton />}>
          <div className="flex w-full justify-center">
            <Messages />
          </div>
        </Suspense>
      );

    default:
      return notFound();
  }
}

// Component implementations
function MessagesLoadingSkeleton() {
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
