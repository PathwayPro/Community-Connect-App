import { BaseThreadCard } from '../main-card';
import { ThreadCardProvider } from '../main-card/base-thread-card';
import { ThreadSearchbar, ThreadCommentInput } from '../common';
import { Comment } from '../../lib/mock-data';
import {
  Heart,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bookmark
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useBlogStore } from '../../store';
import { UserProfile } from '@/features/user-profile/types';

interface CommentCardProps {
  comment: Comment;
  className?: string;
  hasReplies?: boolean;
  iconClassName?: string;
  hasComments?: boolean;
  variant?: 'primary' | 'secondary';
  user: UserProfile;
}

export const CommentCard = ({
  comment,
  className,
  hasReplies = true,
  iconClassName,
  hasComments = true,
  variant = 'primary',
  user
}: CommentCardProps) => {
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showCommentSearchbar, setShowCommentSearchbar] = useState(true);
  const [isLiked, setIsLiked] = useState(comment.liked_by_user || false);
  const [isSaved, setIsSaved] = useState(comment.saved_by_user || false);
  const [likes, setLikes] = useState(comment.likes || 0);

  const { toggleCommentLike, toggleCommentSave, createSubComment } =
    useBlogStore();

  console.log('| - - - - - - - > COMMENT:', comment);

  // handle like
  const handleLike = async () => {
    try {
      const liked = await toggleCommentLike(comment.id);
      setIsLiked(liked.likeStatus === 'liked');
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  // handle save
  const handleSave = async () => {
    try {
      const saved = await toggleCommentSave(comment.id);
      setIsSaved(saved.saveStatus === 'saved');
    } catch (error) {
      console.error('Error toggling comment save:', error);
    }
  };

  // handle comment click
  const handleCommentClick = () => {
    setShowCommentSection(!showCommentSection);
    setShowCommentInput(false);
    setShowCommentSearchbar(true);
  };

  // handle comment submit
  const handleCommentSubmit = async (content: string) => {
    try {
      await createSubComment(comment.id, content);
      setShowCommentSection(false);
      // Optionally refresh the comment list
    } catch (error) {
      console.error('Error creating sub-comment:', error);
    }
  };

  return (
    <ThreadCardProvider
      value={{ isExpanded: !!comment, onExpandClick: () => {} }}
    >
      <BaseThreadCard className={cn('w-full border-none bg-muted', className)}>
        <BaseThreadCard.Header>
          <BaseThreadCard.Author
            name={comment.authorName}
            avatarUrl={comment.avatarUrl}
            timeAgo={comment.timeAgo}
          />
        </BaseThreadCard.Header>

        <BaseThreadCard.Content>
          <BaseThreadCard.Text content={comment.content} />
        </BaseThreadCard.Content>

        <BaseThreadCard.Actions>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-2 rounded-full p-1 px-2 text-gray-500 hover:bg-neutral-light-200 group-hover:bg-neutral-light-200',
                iconClassName
              )}
            >
              <Heart
                className={`h-5 w-5 transition-colors duration-200 ${
                  isLiked ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              <span>{likes}</span>
            </button>
            {hasComments && (
              <button
                className={cn(
                  'flex items-center gap-2 rounded-full p-1 px-2 text-gray-500 hover:bg-neutral-light-200',
                  iconClassName
                )}
                onClick={handleCommentClick}
              >
                <MessageSquare className="h-5 w-5" />
                <span>{comment.comments || 0}</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
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
            {hasReplies && comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowCommentSection(!showCommentSection)}
                className="flex items-center gap-2 rounded-full p-1 text-primary-500 hover:bg-neutral-light-200"
              >
                {showCommentSection ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                {showCommentSection ? 'Hide Comments' : 'View Comments'}
              </button>
            )}
          </div>
        </BaseThreadCard.Actions>

        {showCommentSection && (
          <BaseThreadCard.Comment>
            {comment.replies?.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                className="bg-white"
                hasReplies={false}
                iconClassName="hover:bg-muted"
                hasComments={false}
                variant={variant}
                user={user}
              />
            ))}
          </BaseThreadCard.Comment>
        )}

        {showCommentSection && showCommentSearchbar && (
          <ThreadSearchbar
            title="Post a comment"
            onCreateThread={() => {
              setShowCommentSearchbar(false);
              setShowCommentInput(true);
            }}
            variant={variant}
            user={user}
          />
        )}
        {showCommentSection && showCommentInput && (
          <ThreadCommentInput
            onSubmit={handleCommentSubmit}
            onCancel={() => {
              setShowCommentInput(false);
              setShowCommentSearchbar(true);
            }}
            variant={variant}
            user={user}
          />
        )}
      </BaseThreadCard>
    </ThreadCardProvider>
  );
};
