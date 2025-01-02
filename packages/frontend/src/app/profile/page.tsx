'use client';

import Link from 'next/link';

export const ProfilePage = () => {
  return (
    <div className="flex w-full flex-col items-center">
      <Link
        href="/profile/update"
        className="flex h-[52px] w-[180px] items-center justify-center rounded-xl bg-primary p-4 text-lg font-bold text-white"
      >
        Update Profile
      </Link>
    </div>
  );
};

export default ProfilePage;
