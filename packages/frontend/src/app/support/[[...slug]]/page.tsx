import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Support } from '@/features/support/components';

interface SupportPageProps {
  params: {
    slug?: string[];
  };
}

export default async function SupportPage({ params }: SupportPageProps) {
  const [action] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /support - Show support dashboard
      return (
        <Suspense fallback={<SupportLoadingSkeleton />}>
          <div className="flex w-full justify-center">
            <Support />
          </div>
        </Suspense>
      );

    default:
      return notFound();
  }
}

// Component implementations
function SupportLoadingSkeleton() {
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
