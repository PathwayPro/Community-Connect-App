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
  const router = useRouter();

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

  return (
    <Card className="w-full overflow-hidden">
      <div className="relative flex flex-col">
        {/* Action Buttons */}
        <div className="absolute right-4 top-4 z-20 flex gap-3">
          <div
            className="cursor-pointer rounded-full bg-primary p-2 hover:bg-secondary"
            onClick={handleEdit}
          >
            <PenBox className="h-4 w-4 text-white" />
          </div>
          <div className="cursor-pointer rounded-full bg-primary p-2 hover:bg-destructive">
            <Trash2 className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Image */}
        <div className="relative h-[320px] w-full">
          <Image
            src={'/event/placeholder-2.jpg'}
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
          <div className="flex flex-col gap-2">
            <IconButton
              label="Preview Resource"
              //   rightIcon="arrowRight"
              leftIcon="eye"
              iconClassName="text-white"
              className="w-full"
              onClick={() => setIsOpen(true)}
            />
            <IconButton
              label="Get Resource"
              //   rightIcon="arrowRight"
              leftIcon="squareArrowTopRight"
              iconClassName="text-white"
              className="w-full"
              onClick={() => {
                window.open(ensureAbsoluteUrl(link || ''), '_blank');
              }}
            />
          </div>
        </div>
      </div>

      <ResourcePreviewCard
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        image={'/event/placeholder-2.jpg'}
        title={title}
        details={details || ''}
        link={link || ''}
        type={type}
      />
    </Card>
  );
};
