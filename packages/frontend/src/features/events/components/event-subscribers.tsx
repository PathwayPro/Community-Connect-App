'use client';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ArrowLeft, UserIcon, UsersIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubscriberCard } from './common/subcriber-card';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';

interface Subscriber {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  avatar?: string;
}

export const EventSubscribers = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventTitle = searchParams.get('title');

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, fetch subscribers from API
    // This is mock data for demonstration
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        // Mock API call
        // const response = await fetch(`/api/events/${eventId}/subscribers`);
        // const data = await response.json();

        // Mock data
        const mockSubscribers: Subscriber[] = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            profession: 'Software Engineer',
            avatar: '/profile/profile.png'
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            profession: 'Product Manager',
            avatar: '/profile/profile.png'
          },
          {
            id: 3,
            firstName: 'Michael',
            lastName: 'Brown',
            profession: 'UI/UX Designer',
            avatar: '/profile/profile.png'
          },
          {
            id: 4,
            firstName: 'Sarah',
            lastName: 'Johnson',
            profession: 'Data Scientist',
            avatar: '/profile/profile.png'
          },
          {
            id: 5,
            firstName: 'David',
            lastName: 'Wilson',
            profession: 'Marketing Specialist',
            avatar: '/profile/profile.png'
          }
        ];

        setSubscribers(mockSubscribers);
        setFilteredSubscribers(mockSubscribers);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchSubscribers();
    }
  }, [eventId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSubscribers(subscribers);
      return;
    }

    const filtered = subscribers.filter(
      (subscriber) =>
        subscriber.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        subscriber.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscriber.profession.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredSubscribers(filtered);
  }, [searchQuery, subscribers]);

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
          {filteredSubscribers.length} people registered for this event
        </p>
      </Card>

      {/* Search */}
      <Card className="p-6">
        <Input
          placeholder="Search subscribers by name or profession..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />

        {/* Subscribers List */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
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
            ))
          ) : filteredSubscribers.length > 0 ? (
            filteredSubscribers.map((subscriber) => (
              <SubscriberCard
                key={subscriber.id}
                id={subscriber.id}
                firstName={subscriber.firstName}
                lastName={subscriber.lastName}
                profession={subscriber.profession}
                avatar={subscriber.avatar}
              />
            ))
          ) : (
            <EmptyStateCard
              title="No subscribers found"
              description="Try a different search query or check back later."
              icon={UserIcon}
            />
          )}
        </div>
      </Card>
    </div>
  );
};
