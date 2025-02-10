import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { NewsForm, NewsList } from '@/features/news/components';

interface NewsPageProps {
  params: {
    slug?: string[];
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const [action, id] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /news - Show all news
      return (
        <Suspense fallback={<NewsLoadingSkeleton />}>
          <div className="flex w-full justify-center">
            <NewsList />
          </div>
        </Suspense>
      );

    case 'create':
      // Handle /news/create
      return (
        <Suspense fallback={<NewsFormSkeleton />}>
          <div className="flex w-full justify-center">
            <NewsForm />
          </div>
        </Suspense>
      );

    case 'edit':
      // Handle /news/edit/:id
      if (!id) return notFound();
      return (
        <Suspense fallback={<NewsFormSkeleton />}>
          <div className="flex w-full justify-center">
            <NewsForm newsId={id} />
          </div>
        </Suspense>
      );

    default:
      return notFound();
  }
}

// Component implementations
function NewsLoadingSkeleton() {
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

function NewsFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/4 animate-pulse rounded bg-gray-200" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
