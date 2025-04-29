import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Admin } from '@/features/admin/components';

interface AdminPageProps {
  params: {
    slug?: string[];
  };
}

export default async function AdminPage({ params }: AdminPageProps) {
  const slugs = params.slug || [];
  console.log('Slugs:', slugs);

  // For /admin (show all messages)
  if (slugs.length === 0) {
    return (
      <Suspense fallback={<AdminLoadingSkeleton />}>
        <div className="flex w-full justify-center">
          <Admin />
        </div>
      </Suspense>
    );
  }

  // Any other pattern should 404
  return notFound();
}

// Component implementations
function AdminLoadingSkeleton() {
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
