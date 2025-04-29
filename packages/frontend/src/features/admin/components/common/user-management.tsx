'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { UserPlus } from 'lucide-react';
import { IconInput } from '@/shared/components/ui/icon-input';
import { UsersTable } from './admin-table/user-table';
import { useUserStore } from '@/features/user-profile/store';
import { useEffect } from 'react';

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { users, isLoading, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex gap-2">
          <IconInput
            leftIcon="search"
            className="w-[250px] rounded-full bg-neutral-light-100"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="h-11">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <UsersTable users={users} />
    </div>
  );
};
