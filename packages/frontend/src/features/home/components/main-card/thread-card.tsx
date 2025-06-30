import { Button } from '@/shared/components/ui/button';
import { MessageSquare, Heart, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { Thread } from '../../lib/mock-data';
import { ThreadCardProvider } from './base-thread-card';
import { BaseThreadCard } from './base-thread-card';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { useBlogStore } from '../../store';
import { Checkbox } from '@/shared/components/ui/checkbox';

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
  isLiked?: boolean;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
  isCommented?: boolean;
  viewThreads: () => void;
  selectedThread?: Thread;
  setSelectedThread?: (thread: Thread) => void | undefined;
  setShowCommentSection?: (show: boolean) => void;
  isOwner?: boolean;
  onEditThread?: (thread: Thread) => void;
  showCheckbox?: boolean;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
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
  liked_by_user,
  isCommented,
  saved_by_user,
  isOwner,
  onEditThread,
  showCheckbox = false,
  selected = false,
  onSelect
}: ThreadCardProps) => {
  const [isLiked, setIsLiked] = useState(liked_by_user);
  const [isSaved, setIsSaved] = useState(saved_by_user);
  const [likes, setLikes] = useState(initialLikes);

  const { toggleLike, toggleSave } = useBlogStore();

  const handleLike = async () => {
    if (!id) {
      return;
    }
    const like = await toggleLike(id);
    const liked: boolean = like ? true : false;
    setIsLiked(liked);
    setLikes((prev) => (liked ? prev + 1 : prev - 1));
  };

  const handleSave = async () => {
    if (!id) {
      return;
    }
    const save = await toggleSave(id);
    const saved: boolean = save ? true : false;
    setIsSaved(saved);
  };

  // handle view thread
  const handleViewThread = () => {
    if (setSelectedThread) {
      setSelectedThread({
        id,
        authorName,
        authorUsername: '',
        authorEmail: '',
        timeAgo,
        content,
        avatarUrl:
          avatarUrl ||
          'https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png',
        imageUrl:
          imageUrl ||
          'https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png',
        likes,
        comments,
        saved_by_user: isSaved,
        liked_by_user: isLiked
      });
    }
    viewThreads();
  };

  const handleEditThread = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditThread) {
      onEditThread({
        id,
        authorName,
        authorUsername: '',
        authorEmail: '',
        timeAgo,
        content,
        avatarUrl: avatarUrl || '',
        imageUrl: imageUrl || '',
        likes,
        comments,
        saved_by_user: isSaved,
        liked_by_user: isLiked
      });
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleViewThread();
    if (setShowCommentSection) {
      setShowCommentSection(true);
    }
  };

  // console.log('this is hte isSaved', isSaved);

  return (
    <ThreadCardProvider
      value={{ isExpanded: !!selectedThread, onExpandClick: handleViewThread }}
    >
      <BaseThreadCard>
        <BaseThreadCard.Header>
          <div className="flex items-center gap-2">
            {showCheckbox && (
              <Checkbox
                checked={selected}
                onCheckedChange={onSelect}
                aria-label="Select thread"
              />
            )}
            <BaseThreadCard.Author
              name={authorName}
              avatarUrl={avatarUrl}
              timeAgo={timeAgo}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-10 rounded-xl"
              onClick={handleViewThread}
            >
              View thread
            </Button>

            {/* {isOwner && (
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={handleEditThread}
              >
                Edit thread
              </Button>
            )} */}
          </div>
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
                className={`h-5 w-5 transition-colors duration-200 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleCommentClick}
              className="flex items-center gap-2 rounded-full p-1 px-2 text-gray-500 hover:bg-neutral-light-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{comments}</span>
            </button>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full p-1 text-gray-500 hover:bg-neutral-light-200"
          >
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
