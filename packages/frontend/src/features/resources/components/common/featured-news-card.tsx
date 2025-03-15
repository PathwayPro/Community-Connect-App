'use client';

import { Clock } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import Image from 'next/image';
import { IconButton } from '@/shared/components/ui/icon-button';
import { ExpandedNewsModal } from './expanded-news-modal';
import { useState } from 'react';

interface FeaturedNewsCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  postedAt: string;
  postedBy: string;
  keywords?: string[];
}

export const FeaturedNewsCard = ({
  title,
  description,
  imageUrl,
  postedAt,
  postedBy,
  keywords = []
}: FeaturedNewsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full bg-primary-300 p-6 text-white">
      <h2 className="mb-6 text-2xl font-bold text-white">Featured News</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <div className="relative h-[280px] w-full">
          <Image
            src={imageUrl || '/event/placeholder-2.jpg'}
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
            {description}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{postedAt}</span>
            </div>
            <span>by {postedBy}</span>
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
            imageUrl={imageUrl || ''}
            newsTitle={title}
            description={description}
            articleUrl={''}
          />
        </div>
      </div>
    </Card>
  );
};
