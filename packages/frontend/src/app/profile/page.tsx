'use client';

import { useAuthContext } from '@/features/auth/providers';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/components/ui/button';

export const ProfilePage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    logout();
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>User: {user.firstName}</p>
      <p>Email: {user.email}</p>

      <Button variant="destructive" className="mt-6" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default ProfilePage;
