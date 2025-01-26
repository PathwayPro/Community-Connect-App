'use client';

import { Calendar, MapPin, Clock } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import Image from 'next/image';
import { IconButton } from '@/shared/components/ui/icon-button';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  address?: string;
  time?: string;
  imageUrl?: string | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EventCard = ({
  id,
  title,
  description,
  date,
  address,
  time,
  imageUrl,
  onEdit,
  onDelete
}: EventCardProps) => {
  const router = useRouter();

  const handleLearnMore = () => {
    router.push(`/events/${id}`);
  };

  return (
    <Card className="overflow-hidden rounded-[24px]">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Image */}
        <div className="p-4">
          <Image
            src={imageUrl || '/event/placeholder.jpg'}
            alt={title}
            className="h-full w-full rounded-[20px] object-cover"
            width={300}
            height={200}
            priority
          />
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col gap-3 p-4">
          <h2 className="font-semibold">{title}</h2>
          <p className="text-justify text-base text-muted-foreground">
            {description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
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
              onClick={onEdit}
            />
            <IconButton
              label="Delete Event"
              rightIcon="trash"
              variant="outline"
              className="w-full"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
