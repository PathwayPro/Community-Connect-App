'use client';

import {
  Calendar,
  MapPin,
  Clock,
  LockIcon,
  UnlockIcon,
  DollarSign
} from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import Image from 'next/image';
import { IconButton } from '@/shared/components/ui/icon-button';
import { useRouter } from 'next/navigation';
import { EventType, Event } from '../../types';
import { useEventStore } from '@/features/events/store/index';
import { formatDate } from 'date-fns';

export const EventCard = ({
  id,
  title,
  subtitle,
  description,
  category_id,
  category,
  location,
  link,
  image,
  is_free,
  type,
  reqConfirm,
  start_date,
  start_time,
  end_time,
  host_name,
  host_bio,
  host_image
}: Event) => {
  const router = useRouter();
  const { deleteEvent } = useEventStore();

  const eventData = {
    id,
    title,
    subtitle,
    description,
    category_id,
    category,
    location,
    link,
    image,
    is_free,
    type,
    reqConfirm,
    start_date,
    start_time,
    end_time,
    host_name,
    host_bio,
    host_image
  };

  const handleLearnMore = () => {
    router.push(
      `/events/${id}?data=${encodeURIComponent(JSON.stringify(eventData))}`
    );
  };

  const handleEdit = () => {
    router.push(
      `/events/edit/${id}?data=${encodeURIComponent(JSON.stringify(eventData))}`
    );
  };

  const handleDelete = async (id: number) => {
    await deleteEvent(id);
    router.push('/events');
  };

  return (
    <Card className="overflow-hidden rounded-[24px]">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Image */}
        <div className="p-4">
          <Image
            src={image || '/event/placeholder.jpg'}
            alt={title}
            className="h-full w-full rounded-[20px] object-cover"
            width={300}
            height={200}
            priority
          />
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold">{title}</h2>
            <div className="flex items-center justify-center rounded-full bg-primary-300 p-3">
              <div className="flex items-center gap-2">
                {is_free === false && (
                  <DollarSign className="h-5 w-5 text-secondary" />
                )}
                {type === EventType.PRIVATE ? (
                  <LockIcon className="h-5 w-5 text-white" />
                ) : (
                  <UnlockIcon className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
          </div>
          <p className="line-clamp-2 text-justify text-base text-muted-foreground">
            {description}
          </p>

          <div className="space-y-2 text-primary">
            <div className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              <span>
                {start_date ? formatDate(start_date, 'PP') : 'No date provided'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              <span>{location || 'No location provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              <span>
                {start_time} - {end_time}
              </span>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <IconButton
              label="Learn More"
              rightIcon="arrowRight"
              className="w-full"
              onClick={handleLearnMore}
            />
            <IconButton
              label="Edit Details"
              rightIcon="pencil"
              className="w-full"
              onClick={handleEdit}
            />
            <IconButton
              label="Delete Event"
              rightIcon="trash"
              variant="outline"
              className="w-full"
              onClick={() => handleDelete(id)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
