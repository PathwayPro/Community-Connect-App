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
  Globe,
  Lock,
  Users,
  PlusCircle
} from 'lucide-react';
import Image from 'next/image';
import { sampleEvents } from './event-list';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface EventDetailsProps {
  eventId: string;
  onBack?: () => void;
  onShare?: () => void;
  onFavorite?: () => void;
  onRegister?: () => void;
  onConnect?: () => void;
  onFollow?: () => void;
}

export const EventDetails = ({
  eventId,
  onBack,
  onShare,
  onFavorite,
  onRegister,
  onConnect,
  onFollow
}: EventDetailsProps) => {
  const event = sampleEvents.find((e) => e.id === eventId);
  const router = useRouter();

  if (!event) {
    notFound();
  }

  const {
    title,
    description,
    date,
    address,
    time,
    imageUrl,
    eventType,
    host,
    tags
  } = event;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={onShare}>
            <Share2 className="h-5 w-5" />
            Share
          </Button>
          <Button onClick={onFavorite}>
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
          src={imageUrl || '/event/placeholder.jpg'}
          alt={title}
          width={1200}
          height={400}
          className="mt-6 h-[400px] w-full rounded-2xl object-cover"
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
            <span className="text-primary">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            <span className="text-primary">{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="text-primary">{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {eventType === 'public' ? (
            <Globe className="h-5 w-5 text-secondary" />
          ) : (
            <Lock className="h-5 w-5 text-secondary" />
          )}
          <span className="capitalize">{eventType} Event</span>
        </div>
        <Button className="w-full" onClick={onRegister}>
          Register Now
        </Button>
      </Card>

      {/* Host Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Hosted by</h2>
        <div className="flex gap-6">
          <Avatar className="h-[100px] w-[100px] bg-warning-500">
            <Image
              src={host?.avatarUrl || '/avatars/placeholder.png'}
              alt={host?.name || 'Host'}
              width={100}
              height={100}
            />
          </Avatar>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">{host?.name}</h3>
            <p className="text-muted-foreground">{host?.bio}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onConnect}>
                <Users className="mr-2 h-4 w-4" />
                Connect
              </Button>
              <Button onClick={onFollow}>Follow</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Event Details Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Event Details</h2>
        <p className="mb-4 text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Bottom Register Button */}
      <Button className="w-full" size="lg" onClick={onRegister}>
        Register Now
      </Button>
    </div>
  );
};
