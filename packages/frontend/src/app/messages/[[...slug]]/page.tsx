import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Messages } from '@/features/messages/components';

interface MessagesPageProps {
  params: {
    slug?: string[];
  };
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const slugs = params.slug || [];
  console.log('Slugs:', slugs);

  // For /messages/6
  if (slugs.length === 1) {
    const userId = slugs[0];
    return (
      <Suspense fallback={<MessagesLoadingSkeleton />}>
        <div className="flex w-full justify-center">
          <Messages userId={userId} />
        </div>
      </Suspense>
    );
  }

  // For /messages (show all messages)
  if (slugs.length === 0) {
    return (
      <Suspense fallback={<MessagesLoadingSkeleton />}>
        <div className="flex w-full justify-center">
          <Messages userId={undefined} />
        </div>
      </Suspense>
    );
  }

  // Any other pattern should 404
  return notFound();
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
