'use client';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ViewProfile, EditProfile } from '@/features/user-profile/components';

interface ProfilePageProps {
  params: {
    slug?: string[];
  };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const [action, id] = params.slug || [];

  switch (action) {
    case undefined:
      // Handle /profile - Show current user's profile
      return (
        <Suspense fallback={<ProfileLoadingSkeleton />}>
          <div className="flex w-full flex-col items-center justify-center">
            <ViewProfile />
          </div>
        </Suspense>
      );

    case 'create':
      // Handle /profile/create
      return (
        <Suspense fallback={<ProfileFormSkeleton />}>
          <div className="flex w-full flex-col items-center justify-center">
            <ViewProfile />
          </div>
        </Suspense>
      );

    case 'edit':
    case 'update':
      // Handle /profile/edit or /profile/update
      return (
        <Suspense fallback={<ProfileFormSkeleton />}>
          <div className="flex w-full flex-col items-center justify-center">
            <EditProfile />
          </div>
        </Suspense>
      );

    default:
      // Handle /profile/:id - Show specific user's profile
      console.log('params.slug', params.slug, id);

      if (!params.slug?.[0]) return notFound();

      return (
        <Suspense fallback={<ProfileLoadingSkeleton />}>
          <div className="flex w-full flex-col items-center justify-center">
            <ViewProfile slug={params.slug?.[0]} />
          </div>
        </Suspense>
      );
  }
};

function ProfileLoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="mx-auto h-32 w-32 animate-pulse rounded-full bg-gray-200" />
      <div className="space-y-2">
        <div className="mx-auto h-8 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mt-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

function ProfileFormSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="h-8 w-1/4 animate-pulse rounded bg-gray-200" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
