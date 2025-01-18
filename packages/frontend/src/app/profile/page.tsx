'use client';

import { ViewProfile } from '@/features/user-profile/components';

export const ProfilePage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <ViewProfile />
    </div>
  );
};

export default ProfilePage;
