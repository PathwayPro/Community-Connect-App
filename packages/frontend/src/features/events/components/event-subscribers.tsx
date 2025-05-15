'use client';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ArrowLeft, UserIcon, UsersIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { useEventStore } from '../store';
import { SubscriberCard } from './common/subscriber-card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import { EventSubscription, EventSubscriptionStatus } from '../types';

export const EventSubscribers = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventTitle = searchParams.get('title');

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { eventSubscriptions, fetchEventSubscriptions } = useEventStore();

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        await fetchEventSubscriptions({
          event_id: Number(eventId)
        });
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchSubscribers();
    }
  }, [eventId, fetchEventSubscriptions]);

  const handleRefreshSubscribers = async () => {
    setIsLoading(true);
    await fetchEventSubscriptions({
      event_id: Number(eventId)
    });
    setIsLoading(false);
  };

  const filteredSubscribers = eventSubscriptions.filter((subscriber) => {
    // First filter by search query
    if (searchQuery.trim() !== '') {
      const matchesSearch =
        subscriber.user.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        subscriber.user.last_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        subscriber.user.profession
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
    }

    // Then filter by status based on active tab
    if (activeTab === 'approved') {
      return subscriber.status === EventSubscriptionStatus.APPROVED;
    } else if (activeTab === 'rejected') {
      return subscriber.status === EventSubscriptionStatus.REJECTED;
    }

    // "all" tab shows everyone
    return true;
  });

  return (
    <div className="container mx-auto max-w-4xl space-y-6 rounded-[24px] bg-white px-6 py-6 shadow-md">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="h-10 border-primary text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
      </div>

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <UsersIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">
            Subscribers for {eventTitle || 'Event'}
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          {eventSubscriptions.length} people registered for this event
        </p>
      </Card>

      {/* Search and Tabs */}
      <Card className="p-6">
        <Input
          placeholder="Search subscribers by name or profession..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Subscribers</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {renderSubscribersList(filteredSubscribers, 'all')}
          </TabsContent>

          <TabsContent value="approved" className="mt-4 space-y-4">
            {renderSubscribersList(filteredSubscribers, 'approved')}
          </TabsContent>

          <TabsContent value="rejected" className="mt-4 space-y-4">
            {renderSubscribersList(filteredSubscribers, 'rejected')}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );

  function renderSubscribersList(
    subscribers: EventSubscription[],
    tabType: string
  ) {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="ml-auto h-9 w-28" />
          </div>
        </Card>
      ));
    }

    if (subscribers.length === 0) {
      return (
        <EmptyStateCard
          title="No subscribers found"
          description={
            tabType === 'all'
              ? 'Try a different search query or check back later.'
              : tabType === 'approved'
                ? 'No approved subscribers yet.'
                : 'No rejected subscribers yet.'
          }
          icon={UserIcon}
        />
      );
    }

    return subscribers.map((subscriber) => (
      <SubscriberCard
        key={subscriber.user.id}
        id={subscriber.user.id}
        subscriptionId={subscriber.id}
        firstName={subscriber.user.first_name}
        lastName={subscriber.user.last_name}
        profession={subscriber.user.profession || ''}
        avatar={subscriber.user.picture_upload_link}
        status={subscriber.status}
        tabType={tabType}
        onRefresh={handleRefreshSubscribers}
      />
    ));
  }
};
