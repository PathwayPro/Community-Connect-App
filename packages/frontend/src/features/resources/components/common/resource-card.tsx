'use client';

import { Clock, PenBox, Trash2 } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import Image from 'next/image';
import { IconButton } from '@/shared/components/ui/icon-button';
import { Badge } from '@/shared/components/ui/badge';
import { useState } from 'react';
import { format } from 'date-fns';
import { ResourcePreviewCard } from './resource-preview-card';
import { useRouter } from 'next/navigation';
import { useResourcesStore } from '../../store';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { DeleteModal } from '../../../../shared/components/modal/delete-modal';
import { resourceTypes } from '../../lib/constants/enums';

interface ResourceCardProps {
  id?: string;
  title: string;
  link?: string;
  details?: string;
  created_at: string;
  type: string;
  user: {
    first_name: string;
    last_name: string;
    picture_upload_link: string;
  };
}

export const ResourceCard = ({
  id,
  title,
  link,
  details,
  created_at,
  type,
  user
}: ResourceCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { deleteResource } = useResourcesStore();
  const { showAlert } = useAlertDialog();

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '#';
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
  };

  const formData = {
    id,
    title,
    link,
    details,
    type
  };

  const handleEdit = () => {
    router.push(
      `/resources/edit/${id}?mode=contentLibrary&data=${encodeURIComponent(
        JSON.stringify(formData)
      )}`
    );
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await deleteResource(id);
      showAlert({
        title: 'Success',
        description: 'Resource deleted successfully',
        type: 'success'
      });

      await fetch('/api/revalidate?path=/resources');
    } catch (error) {
      console.error('Error deleting resource:', error);
      showAlert({
        title: 'Error',
        description: 'An error occurred while deleting the resource',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getResourceImage = () => {
    const resourceType = resourceTypes.find((item) => item.value === type);
    if (!resourceType) return '/resources/others.jpg';

    switch (type) {
      case 'RESUME':
        return '/resources/resume.png';
      case 'COVER_LETTER':
        return '/resources/cover-letter.jpg';
      case 'LINKEDIN':
        return '/resources/linkedin.png';
      case 'BUSINESS_CARD':
        return '/resources/business-card.jpg';
      case 'INVOICE':
        return '/resources/invoice.png';
      case 'PORTFOLIO':
        return '/resources/others.jpg';
      case 'EMAIL_SIGNATURE':
        return '/resources/others.jpg';
      case 'PERSONAL_BRANDING':
        return '/resources/others.jpg';
      case 'JOB_APPLICATION_TRACKER':
        return '/resources/others.jpg';
      case 'INTERVIEW_PREP':
        return '/resources/others.jpg';
      case 'NETWORKING_TIPS':
        return '/resources/others.jpg';
      case 'CAREER_PLANNING':
        return '/resources/others.jpg';
      case 'SALARY_NEGOTIATION':
        return '/resources/others.jpg';
      case 'BANNER':
        return '/resources/others.jpg';
      default:
        return '/resources/others.jpg';
    }
  };

  const getResourceTypeLabel = () => {
    const resourceType = resourceTypes.find((item) => item.value === type);
    return resourceType ? resourceType.label : type;
  };

  return (
    <Card className="w-full overflow-hidden">
      <AlertDialogUI />
      <DeleteModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Resource"
        description="Are you sure you want to delete this resource? This action cannot be undone."
      />
      <div className="relative flex flex-col">
        {/* Action Buttons */}
        <div className="absolute right-4 top-4 z-20 flex gap-3">
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

        {/* Image */}
        <div className="relative h-[320px] w-full">
          <Image
            src={getResourceImage()}
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
              {getResourceTypeLabel()}
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

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <IconButton
              label="Preview Resource"
              leftIcon="eye"
              iconClassName="text-white"
              className="w-full"
              onClick={() => setIsOpen(true)}
            />
            {link && (
              <IconButton
                label="View Resource"
                leftIcon="squareArrowTopRight"
                iconClassName="text-white"
                className="w-full"
                onClick={() => {
                  window.open(ensureAbsoluteUrl(link), '_blank');
                }}
              />
            )}
          </div>
        </div>
      </div>

      <ResourcePreviewCard
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        image={getResourceImage()}
        title={title}
        details={details || ''}
        link={link || ''}
        type={getResourceTypeLabel()}
      />
    </Card>
  );
};
