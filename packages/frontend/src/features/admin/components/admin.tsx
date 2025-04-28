'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import { UserManagement } from './common/user-management';
import { ApplicationSettings } from './common/application-settings';
import { SystemStatus } from './common/system-status';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, configure application settings, and monitor system
          status.
        </p>
      </div>

      <Tabs
        defaultValue="users"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">Application Settings</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>

        <TabsContent
          value="users"
          className="mt-4 rounded-lg border bg-white p-4"
        >
          <UserManagement />
        </TabsContent>

        <TabsContent
          value="settings"
          className="mt-4 rounded-lg border bg-white p-4"
        >
          <ApplicationSettings />
        </TabsContent>

        <TabsContent
          value="system"
          className="mt-4 rounded-lg border bg-white p-4"
        >
          <SystemStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};
