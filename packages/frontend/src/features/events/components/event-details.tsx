'use client';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar } from '@/shared/components/ui/avatar';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  Lock,
  Users,
  Unlock,
  DollarSign,
  UserIcon
} from 'lucide-react';
import Image from 'next/image';
import { notFound, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Event } from '../types';
import { EventsTypes } from '../lib/validation';
import { toSentenceCase } from '@/shared/lib/utils';
import { formatDate } from 'date-fns';

interface EventDetailsProps {
  onBack?: () => void;
  onShare?: () => void;
  onFavorite?: () => void;
  onRegister?: () => void;
  onConnect?: () => void;
  onFollow?: () => void;
}

export const EventDetails = ({
  onShare,
  onFavorite,
  onRegister,
  onConnect,
  onFollow
}: EventDetailsProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const eventData: Event = searchParams.get('data')
    ? JSON.parse(decodeURIComponent(searchParams.get('data')!))
    : null;

  if (!eventData) {
    notFound();
  }

  console.log('eventData', eventData);

  const {
    title,
    description,
    start_date,
    location,
    start_time,
    image,
    type,
    end_time,
    is_free,
    category,
    host_name,
    host_bio,
    host_image
  } = eventData;

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
        <div className="flex gap-2">
          <Button
            onClick={onShare}
            className="h-10 border-primary text-primary"
            variant="outline"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
          <Button onClick={onFavorite} className="h-10">
            <Heart className="h-5 w-5" />
            Favourite
          </Button>
          {/* <Button onClick={onCreateEvent} className="bg-secondary-500">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Event
          </Button> */}
        </div>
      </div>

      {/* Hero Image Section */}
      <Card className="rounded-[24px] p-6">
        <h2 className="text-center font-bold">{title}</h2>
        <Image
          src={image || '/event/placeholder.jpg'}
          alt={title}
          width={1200}
          height={600}
          className="mt-6 aspect-[2/1] h-auto w-full rounded-2xl object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
      </Card>

      {/* Event Info Card */}
      <Card className="space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-secondary" />
            <span className="text-primary">
              {start_date ? formatDate(start_date, 'PP') : 'No date provided'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            <span className="text-primary">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="text-primary">
              {start_time} - {end_time}
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            {type === EventsTypes.PUBLIC ? (
              <Unlock className="h-5 w-5 text-secondary" />
            ) : (
              <Lock className="h-5 w-5 text-secondary" />
            )}
            <span className="text-primary">{toSentenceCase(type)} Event</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-secondary" />
            <span className="text-primary">{is_free ? 'Free' : 'Paid'}</span>
          </div>
        </div>

        <Button className="h-12 w-full" onClick={onRegister}>
          Register Now
        </Button>
      </Card>

      {/* Host Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Hosted by</h2>
        <div className="flex gap-6">
          <Avatar className="h-[100px] w-[100px] bg-warning-500">
            <Image
              src={host_image || '/profile/profile.png'}
              alt={'Host'}
              width={100}
              height={100}
              priority
            />
          </Avatar>
          <div className="flex flex-col gap-2">
            <h6 className="font-medium">{host_name}</h6>
            <p className="text-justify text-muted-foreground">{host_bio}</p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={onConnect}
                className="h-10 w-[200px] border-primary text-primary"
              >
                <Users className="mr-2 h-4 w-4" />
                Connect
              </Button>
              <Button onClick={onFollow} className="h-10 w-[200px]">
                <UserIcon className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Event Details Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Event Details</h2>
        <p className="mb-4 text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{category?.name}</Badge>
        </div>
      </Card>

      {/* Bottom Register Button */}
      <Button className="h-12 w-full" onClick={onRegister}>
        Register Now
      </Button>
    </div>
  );
};
