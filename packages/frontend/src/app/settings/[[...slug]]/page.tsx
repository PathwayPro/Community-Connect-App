import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Settings } from '@/features/settings/components';

interface SettingsPageProps {
  params: {
    slug?: string[];
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const [action] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /settings - Show settings page
      return (
        <Suspense fallback={<SettingsLoadingSkeleton />}>
          <div className="flex w-full justify-center">
            <Settings />
          </div>
        </Suspense>
      );

    default:
      return notFound();
  }
}

// Component implementations
function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/4 animate-pulse rounded bg-gray-200" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-12 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
