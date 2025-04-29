import { BaseThreadCard } from '../main-card';
import { ThreadCardProvider } from '../main-card/base-thread-card';
import { ThreadSearchbar, ThreadCommentInput } from '../common';
import { Comment } from '../../lib/mock-data';
import { Heart, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
interface CommentCardProps {
  comment: Comment;
  className?: string;
  hasReplies?: boolean;
  iconClassName?: string;
  hasComments?: boolean;
  variant?: 'primary' | 'secondary';
}

export const CommentCard = ({
  comment,
  className,
  hasReplies = true,
  iconClassName,
  hasComments = true,
  variant = 'primary'
}: CommentCardProps) => {
  console.log('ENTRA COMMENTS???');
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showCommentSearchbar, setShowCommentSearchbar] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);

  // handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev! - 1 : prev! + 1));
  };

  // handle comment click
  const handleCommentClick = () => {
    setShowCommentSection(!showCommentSection);
    setShowCommentInput(false);
    setShowCommentSearchbar(true);
  };

  // handle comment submit
  const handleCommentSubmit = (comment: string) => {
    console.log('New comment:', comment);
    if (setShowCommentSection) {
      setShowCommentSection(false);
    }
  };

  return (
    <ThreadCardProvider
      value={{ isExpanded: !!comment, onExpandClick: () => {} }}
    >
      <BaseThreadCard className={cn('border-none bg-muted', className)}>
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
                <span>{comment.comments}</span>
              </button>
            )}
          </div>
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
          />
        )}
      </BaseThreadCard>
    </ThreadCardProvider>
  );
};
