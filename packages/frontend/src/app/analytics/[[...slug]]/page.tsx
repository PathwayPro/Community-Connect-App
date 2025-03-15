import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Analytics } from '@/features/analytics/components/analytics';

interface AnalyticsPageProps {
  params: {
    slug?: string[];
  };
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const [action] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /analytics - Show analytics page
      return (
        <Suspense fallback={<AnalyticsLoadingSkeleton />}>
          <div className="flex w-full justify-center">
            <Analytics />
          </div>
        </Suspense>
      );

    default:
      return notFound();
  }
}

// Component implementations
function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
