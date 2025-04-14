'use client';

import { Clock, PenBox, Trash2 } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import Image from 'next/image';
import { IconButton } from '@/shared/components/ui/icon-button';
import { ExpandedNewsModal } from './expanded-news-modal';
import { useState } from 'react';
import { format } from 'date-fns';

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
  title,
  details,
  image,
  created_at,
  user,
  type,
  link
}: FeaturedNewsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <Card className="mx-auto w-full bg-primary-300 p-6 text-white">
      <div className="flex justify-between">
        <h2 className="mb-6 text-2xl font-bold text-white">Featured News</h2>
        <div className="flex h-8 gap-3">
          <div className="cursor-pointer rounded-full bg-primary p-2 hover:bg-secondary">
            <PenBox className="h-4 w-4 text-white" />
          </div>
          <div className="cursor-pointer rounded-full bg-primary p-2 hover:bg-destructive">
            <Trash2 className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <div className="relative h-[280px] w-full">
          <Image
            src={image || '/event/placeholder-2.jpg'}
            alt={title}
            className="rounded-[20px] object-cover"
            fill
            priority
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
              <span>{format(created_at, 'MMM d, yyyy')}</span>
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
