'use client';

import { Clock } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import Image from 'next/image';
import { IconButton } from '@/shared/components/ui/icon-button';
import { Badge } from '@/shared/components/ui/badge';
import { ExpandedNewsModal } from './expanded-news-modal';
import { useState } from 'react';

interface NewsCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  details: string;
  keywords: string[];
  imageUrl?: string;
  postedAt: string;
  postedBy: string;
  onEdit?: () => void;
  onDelete?: () => void;
  mode: string;
}

export const NewsCard = ({
  title,
  subtitle,
  details,
  keywords,
  imageUrl,
  postedAt,
  postedBy,
  mode
}: NewsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full overflow-hidden">
      <div className="flex flex-col">
        {/* Image */}
        <div className="relative h-[320px] w-full">
          <Image
            src={imageUrl || '/event/placeholder-2.jpg'}
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
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}

          <p className="line-clamp-3 text-justify text-sm text-muted-foreground">
            {details}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>

          {/* Posted Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{postedAt}</span>
            </div>
            <span>by {postedBy}</span>
          </div>

          {/* Action Button */}
          <IconButton
            label={
              mode === 'news'
                ? 'Read More'
                : mode === 'contentLibrary'
                  ? 'Get Resource'
                  : 'View Opportunity'
            }
            rightIcon={mode === 'news' ? 'arrowRight' : ''}
            leftIcon={mode === 'contentLibrary' ? 'squareArrowTopRight' : ''}
            iconClassName="text-white"
            className="w-full"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
      <ExpandedNewsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        imageUrl={imageUrl || ''}
        newsTitle={title}
        description={details}
        articleUrl={''}
      />
    </Card>
  );
};
