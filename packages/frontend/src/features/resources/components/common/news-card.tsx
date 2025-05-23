'use client';

import { Clock, PenBox, Trash2 } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import Image from 'next/image';
import { IconButton } from '@/shared/components/ui/icon-button';
import { Badge } from '@/shared/components/ui/badge';
import { ExpandedNewsModal } from './expanded-news-modal';
import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useNewsStore } from '../../store';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { DeleteModal } from '../../../../shared/components/modal/delete-modal';
import { Permission, useRole } from '@/features/user-profile/hooks/useRole';
import { useUserStore } from '@/features/user-profile/store';

interface NewsCardProps {
  id?: string;
  title: string;
  details: string;
  type: string;
  image?: string;
  link?: string;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    picture_upload_link: string;
  };
}

export const NewsCard = ({
  id,
  title,
  details,
  type,
  image,
  link,
  created_at,
  user
}: NewsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { deleteNews } = useNewsStore();
  const { showAlert } = useAlertDialog();
  const { hasRole, hasPermission } = useRole();
  const { user: currentUser } = useUserStore();

  const getPermissionType = () => {
    switch (type) {
      case 'news':
        return { edit: 'edit:news', delete: 'delete:news' };
      case 'resource':
        return { edit: 'edit:resource', delete: 'delete:resource' };
      case 'opportunity':
        return { edit: 'create:opportunity', delete: 'delete:opportunity' };
      default:
        return { edit: '', delete: '' };
    }
  };

  // Check if current user is the creator of this news item
  const isCreator = currentUser?.id?.toString() === user?.id?.toString();

  // Get the edit/delete permission types based on content type
  const permissions = getPermissionType();

  // ADMIN can edit/delete all news, other users can only edit/delete their own
  const canEdit =
    hasRole('ADMIN') ||
    (isCreator && hasPermission(permissions.edit as Permission));
  const canDelete =
    hasRole('ADMIN') ||
    (isCreator && hasPermission(permissions.delete as Permission));

  const handleEdit = () => {
    const newsData = {
      id,
      title,
      details,
      type,
      image,
      link,
      created_at,
      user
    };

    router.push(
      `/resources/edit/${id}?mode=news&data=${encodeURIComponent(JSON.stringify(newsData))}`
    );
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      const success = await deleteNews(id);

      if (success) {
        showAlert({
          title: 'Success',
          description: 'News deleted successfully',
          type: 'success'
        });
      } else {
        throw new Error('Failed to delete news');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      showAlert({
        title: 'Error',
        description: 'An error occurred while deleting the news',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <AlertDialogUI />
      <DeleteModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete News"
        description="Are you sure you want to delete this news item? This action cannot be undone."
      />
      <div className="relative flex flex-col">
        {/* Action Buttons */}
        {(canEdit || canDelete) && (
          <div className="absolute right-4 top-4 z-20 flex gap-3">
            {canEdit && (
              <div
                className="cursor-pointer rounded-full bg-primary p-2 hover:bg-secondary"
                onClick={handleEdit}
              >
                <PenBox className="h-4 w-4 text-white" />
              </div>
            )}
            {canDelete && (
              <div
                className="cursor-pointer rounded-full bg-primary p-2 hover:bg-destructive"
                onClick={handleDelete}
              >
                <Trash2
                  className={`h-4 w-4 text-white ${isDeleting ? 'animate-spin' : ''}`}
                />
              </div>
            )}
          </div>
        )}

        {/* Image */}
        <div className="relative h-[320px] w-full">
          <Image
            src={image || '/event/placeholder-2.jpg'}
            alt={title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-4">
          <h2 className="text-xl font-semibold">{title}</h2>

          <p className="line-clamp-3 text-justify text-sm text-muted-foreground">
            {details}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          </div>

          {/* Posted Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(created_at), 'MMM d, yyyy')}</span>
            </div>
            <span>
              by {user.first_name} {user.last_name}
            </span>
          </div>

          {/* Action Button */}
          <IconButton
            label="Read More"
            leftIcon="squareArrowTopRight"
            iconClassName="text-white"
            className="w-full"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
      <ExpandedNewsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        image={image || ''}
        newsTitle={title}
        description={details}
        articleUrl={link || ''}
      />
    </Card>
  );
};
