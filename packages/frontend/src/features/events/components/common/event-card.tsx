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
import { EventType, Event, EventWithHost } from '../../types';
import { useEventStore } from '@/features/events/store/index';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { DeleteModal } from '@/shared/components/modal/delete-modal';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { useUserStore } from '@/features/user-profile/store';

interface EventInfoProps {
  icon: React.ReactNode;
  text: string;
}

const EventInfo = ({ icon, text }: EventInfoProps) => (
  <div className="flex items-center gap-2 text-base">
    {icon}
    <span>{text}</span>
  </div>
);

export const EventCard = ({
  id,
  title,
  description,
  location,
  image,
  is_free,
  type,
  start_date,
  start_time,
  end_time,
  host_id,
  ...eventProps
}: Event) => {
  const router = useRouter();
  const { deleteEvent } = useEventStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showAlert } = useAlertDialog();
  const { user } = useUserStore();

  const isHost = host_id === user?.id;

  const eventData = {
    id,
    title,
    description,
    location,
    image,
    is_free,
    type,
    start_date,
    start_time,
    end_time,
    host_id,
    isHost,
    ...eventProps
  } as EventWithHost;

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent(id);
      showAlert({
        title: 'Success',
        description: 'Event deleted successfully',
        type: 'success'
      });
      router.refresh();
    } catch (error) {
      showAlert({
        title: 'Error',
        description: 'An error occurred while deleting the event',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-[24px]">
      <AlertDialogUI />
      <div className="grid grid-cols-2 gap-4">
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

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold">{title}</h2>
            <div className="flex items-center justify-center rounded-full bg-primary-300 p-3">
              <div className="flex items-center gap-2">
                {!is_free && <DollarSign className="h-5 w-5 text-secondary" />}
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
            <EventInfo
              icon={<Calendar className="h-4 w-4" />}
              text={
                start_date ? formatDate(start_date, 'PP') : 'No date provided'
              }
            />
            <EventInfo
              icon={<MapPin className="h-4 w-4" />}
              text={location || 'No location provided'}
            />
            <EventInfo
              icon={<Clock className="h-4 w-4" />}
              text={`${start_time} - ${end_time}`}
            />
          </div>

          <div className="mt-auto space-y-2">
            <IconButton
              label="Learn More"
              rightIcon="arrowRight"
              className="w-full"
              onClick={handleLearnMore}
            />
            {isHost && (
              <>
                <IconButton
                  label="Edit Details"
                  rightIcon="pencil"
                  className="w-full"
                  onClick={handleEdit}
                />
                <IconButton
                  label="Delete Event"
                  rightIcon="delete"
                  variant="outline"
                  className="w-full hover:border-destructive hover:bg-destructive hover:text-white"
                  onClick={() => setIsDeleteModalOpen(true)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </Card>
  );
};
