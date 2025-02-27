import { Button } from '@/shared/components/ui/button';
import { MessageSquare, Heart, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { Thread } from '../../lib/mock-data';
import { ThreadCardProvider } from './base-thread-card';
import { BaseThreadCard } from './base-thread-card';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';

interface ThreadCardProps {
  id: number;
  authorName: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  avatarUrl: string;
  tags?: string[];
  isSaved?: boolean;
  viewThreads: () => void;
  selectedThread?: Thread;
  setSelectedThread?: (thread: Thread) => void | undefined;
  setShowCommentSection?: (show: boolean) => void;
}

export const ThreadCard = ({
  id,
  authorName,
  timeAgo,
  content,
  imageUrl,
  likes: initialLikes,
  comments,
  avatarUrl,
  tags,
  viewThreads,
  selectedThread,
  setSelectedThread,
  setShowCommentSection,
  isSaved
}: ThreadCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // handle view thread
  const handleViewThread = () => {
    if (setSelectedThread) {
      setSelectedThread({
        id,
        authorName,
        authorUsername: '',
        timeAgo,
        content,
        avatarUrl,
        imageUrl: imageUrl || '',
        likes,
        comments,
        isSaved: isSaved
      });
    }
    viewThreads();
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleViewThread();
    if (setShowCommentSection) {
      setShowCommentSection(true);
    }
  };

  console.log('this is hte isSaved', isSaved);

  return (
    <ThreadCardProvider
      value={{ isExpanded: !!selectedThread, onExpandClick: handleViewThread }}
    >
      <BaseThreadCard>
        <BaseThreadCard.Header>
          <BaseThreadCard.Author
            name={authorName}
            avatarUrl={avatarUrl}
            timeAgo={timeAgo}
          />
          <Button
            variant="secondary"
            className="h-12 rounded-full"
            onClick={handleViewThread}
          >
            View thread
          </Button>
        </BaseThreadCard.Header>

        <BaseThreadCard.Content>
          <BaseThreadCard.Text content={content} />
          {tags && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

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
        </BaseThreadCard.Content>

        <BaseThreadCard.Actions>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 rounded-full p-1 px-2 text-gray-500 hover:bg-neutral-light-200 group-hover:bg-neutral-light-200"
            >
              <Heart
                className={`h-5 w-5 transition-colors duration-200 ${
                  isLiked ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              <span>{likes}</span>
            </button>
            <button
              className="flex items-center gap-2 rounded-full p-1 px-2 text-gray-500 hover:bg-neutral-light-200"
              onClick={handleCommentClick}
            >
              <MessageSquare className="h-5 w-5" />
              <span>{comments}</span>
            </button>
          </div>
          <button className="flex items-center gap-2 rounded-full p-1 text-gray-500 hover:bg-neutral-light-200">
            <Bookmark
              className={cn(
                'h-5 w-5',
                isSaved ? 'fill-primary-500 text-primary-500' : ''
              )}
            />
          </button>
        </BaseThreadCard.Actions>
      </BaseThreadCard>
    </ThreadCardProvider>
  );
};
