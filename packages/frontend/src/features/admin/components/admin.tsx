'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import { UserManagement } from './common/user-management';
import { Analytics } from '@/features/analytics/components/analytics';
import { UsersIcon } from 'lucide-react';
import { ChartAreaIcon } from 'lucide-react';
import { PermissionWrapper } from '@/shared/components/navigation/permission-wrapper/permission-wrapper';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          View analytics, manage users, and configure application settings.
        </p>
      </div>

      <Tabs
        defaultValue="analytics"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <ChartAreaIcon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="analytics"
          className="mt-4 rounded-2xl border bg-white"
        >
          <Analytics />
        </TabsContent>
        <TabsContent
          value="users"
          className="mt-4 rounded-2xl border bg-white p-4"
        >
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Admin = () => {
  return (
    <PermissionWrapper
      requiredRoles={['ADMIN']}
      fallbackRoute="/home"
      permissionDeniedMessage="Only administrators can access this page."
    >
      <AdminDashboard />
    </PermissionWrapper>
  );
};
