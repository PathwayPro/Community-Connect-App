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
import { IconButton } from '@/shared/components/ui/icon-button';
import { useRouter } from 'next/navigation';
import { EventType, Event } from '../../types';
import { useEventStore } from '@/features/events/store/index';
import { useState } from 'react';
import { DeleteModal } from '@/shared/components/modal/delete-modal';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import {
  useUserStore,
  useInitializeUserStore
} from '@/features/user-profile/store';
import { formatDate } from 'date-fns';
import { useRole } from '@/features/user-profile/hooks/useRole';
import { ImagePreview } from '@/shared/components/image/image-preview';

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
  host_id
}: Event) => {
  const router = useRouter();
  const { deleteEvent } = useEventStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showAlert } = useAlertDialog();
  const { user } = useUserStore();
  const { hasRole, hasPermission } = useRole();

  // Initialize user store
  useInitializeUserStore();

  // Ensure proper type conversion for comparison
  const isHost =
    user?.id !== undefined &&
    host_id !== undefined &&
    Number(user.id) === Number(host_id);

  // Check permissions: Admin can edit/delete all events, mentors only their own
  const canEdit = hasRole('ADMIN') || (isHost && hasPermission('edit:event'));
  const canDelete =
    hasRole('ADMIN') || (isHost && hasPermission('delete:event'));

  const handleLearnMore = () => {
    router.push(`/events/${id}`);
  };

  const handleEdit = () => {
    router.push(`/events/edit/${id}`);
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
      console.error('Error deleting event:', error);
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
    <Card className="overflow-hidden rounded-2xl border border-neutral-light-300 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl md:mx-0">
      <AlertDialogUI />
      <div className="flex h-full flex-col md:flex-row">
        {/* Image Section */}
        <div className="flex w-full items-center justify-center p-3 sm:p-4 md:w-2/5 md:p-6">
          <div className="group aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-neutral-light-400 bg-neutral-light-100 sm:max-w-none">
            <ImagePreview
              imagePath={image}
              fallbackImage={'/event/placeholder.jpg'}
              alt={title}
              width={640}
              height={360}
              priority
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-4 md:gap-4 md:p-6">
          <div className="flex flex-col gap-2">
            {/* Title and Icon */}
            <div className="flex items-center justify-between gap-2">
              <h2 className="line-clamp-1 text-lg font-semibold text-neutral-dark-700 sm:text-xl md:text-2xl">
                {title}
              </h2>
              <span className="flex items-center rounded-full bg-primary-300 p-2">
                {!is_free && (
                  <DollarSign className="mr-1 h-5 w-5 text-secondary-500" />
                )}
                {type === EventType.PRIVATE ? (
                  <LockIcon className="h-5 w-5 text-white" />
                ) : (
                  <UnlockIcon className="h-5 w-5 text-white" />
                )}
              </span>
            </div>
            {/* Description */}
            <p className="line-clamp-3 text-sm text-neutral-dark-300 sm:text-base">
              {description}
            </p>
            {/* Info Row */}
            <div className="mt-2 flex flex-wrap gap-3 text-primary-700 sm:gap-4">
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
          </div>
          {/* Buttons Row */}
          <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row">
            <IconButton
              label="Learn More"
              rightIcon="arrowRight"
              className="w-full flex-1 transition-transform duration-200 hover:scale-105"
              onClick={handleLearnMore}
            />
            {canEdit && (
              <IconButton
                label="Edit Details"
                rightIcon="pencil"
                className="w-full flex-1 transition-transform duration-200 hover:scale-105"
                onClick={handleEdit}
              />
            )}
            {canDelete && (
              <IconButton
                label="Delete Event"
                rightIcon="delete"
                variant="outline"
                className="w-full flex-1 transition-transform duration-200 hover:scale-105 hover:border-destructive hover:bg-destructive hover:text-white"
                onClick={() => setIsDeleteModalOpen(true)}
              />
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
