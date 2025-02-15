import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Networking } from '@/features/networking/components';

interface NetworkingPageProps {
  params: {
    slug?: string[];
  };
}

export default async function NetworkingPage({ params }: NetworkingPageProps) {
  const [action] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /networking - Show all networking
      return (
        <Suspense fallback={<NetworkingLoadingSkeleton />}>
          <div className="flex w-full justify-center">
            <Networking />
          </div>
        </Suspense>
      );

    default:
      return notFound();
  }
}

// Component implementations
function NetworkingLoadingSkeleton() {
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
