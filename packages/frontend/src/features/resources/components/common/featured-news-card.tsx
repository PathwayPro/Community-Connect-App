'use client';

import { Clock, PenBox, Trash2 } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { IconButton } from '@/shared/components/ui/icon-button';
import { ExpandedNewsModal } from './expanded-news-modal';
import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useNewsStore } from '../../store';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { DeleteModal } from '../../../../shared/components/modal/delete-modal';
import { ImagePreview } from '@/shared/components/image/image-preview';

interface FeaturedNewsCardProps {
  id?: string;
  title: string;
  details: string;
  type: string;
  image?: string;
  link?: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    picture_upload_link: string;
  };
}

export const FeaturedNewsCard = ({
  id,
  title,
  details,
  image,
  created_at,
  user,
  type,
  link
}: FeaturedNewsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { deleteNews } = useNewsStore();
  const { showAlert } = useAlertDialog();

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

  console.log('newsData', newsData);

  const fullName = `${user.first_name} ${user.last_name}`;

  const handleEdit = () => {
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
    <Card className="mx-auto w-full bg-primary-300 p-6 text-white">
      <AlertDialogUI />
      <DeleteModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete News"
        description="Are you sure you want to delete this news item? This action cannot be undone."
      />
      <div className="flex justify-between">
        <h2 className="mb-6 text-2xl font-bold text-white">Featured News</h2>
        <div className="flex h-8 gap-3">
          <div
            className="cursor-pointer rounded-full bg-primary p-2 hover:bg-secondary"
            onClick={handleEdit}
          >
            <PenBox className="h-4 w-4 text-white" />
          </div>
          <div
            className="cursor-pointer rounded-full bg-primary p-2 hover:bg-destructive"
            onClick={handleDelete}
          >
            <Trash2
              className={`h-4 w-4 text-white ${isDeleting ? 'animate-spin' : ''}`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <div className="relative h-[280px] w-full">
          <ImagePreview
            imagePath={image}
            alt={title}
            className="rounded-[20px] object-cover"
            fallbackImage="/public/news/3.png"
            fill={true}
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-3xl font-semibold text-white">{title}</h1>

          <p className="font-regular line-clamp-3 text-justify text-base text-white">
            {details}
          </p>

          {/* Type Badge */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{type}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(created_at), 'MMM d, yyyy')}</span>
            </div>
            <span>by {fullName}</span>
          </div>

          <IconButton
            label="Read Full Article"
            leftIcon="link"
            className="hover:bg-neutral-dark-900 mt-auto w-full bg-neutral-dark-800 text-white"
            onClick={() => setIsOpen(true)}
          />

          <ExpandedNewsModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            image={image || ''}
            newsTitle={title}
            description={details}
            articleUrl={link || ''}
          />
        </div>
      </div>
    </Card>
  );
};
