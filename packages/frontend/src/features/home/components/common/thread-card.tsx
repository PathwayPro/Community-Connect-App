import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { MessageSquare, Heart, Bookmark } from 'lucide-react';
import Image from 'next/image';

interface ThreadCardProps {
  authorName: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  avatarUrl: string;
}

export const ThreadCard = ({
  authorName,
  timeAgo,
  content,
  imageUrl,
  likes,
  comments,
  avatarUrl
}: ThreadCardProps) => {
  const handleSeeMore = () => {
    console.log('see more');
  };

  return (
    <div className="h-fit max-w-[710px] space-y-3 rounded-xl border border-neutral-light-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-16 w-16 bg-warning-500">
            <AvatarImage src={avatarUrl} alt={authorName} />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{authorName}</span>
            <span className="text-gray-500">{timeAgo}</span>
          </div>
        </div>
        <Button variant="secondary" className="rounded-full">
          View thread
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="line-clamp-2 text-neutral-dark-600">
          {content}{' '}
          <span
            className="cursor-pointer text-primary-200 hover:underline"
            onClick={handleSeeMore}
          >
            ...see more
          </span>
        </p>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Thread content"
            width={710}
            height={437}
            className="w-full rounded-md object-cover"
            priority
          />
        )}
      </div>

      {/* Engagement */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full p-1 px-2 text-gray-500 hover:bg-neutral-light-200">
            <Heart className="h-5 w-5" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full p-1 px-2 text-gray-500 hover:bg-neutral-light-200">
            <MessageSquare className="h-5 w-5" />
            <span>{comments}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full p-1 text-gray-500 hover:bg-neutral-light-200">
          <Bookmark className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
