import { MessageSquare, Heart, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { Thread } from '../../lib/mock-data';
import { ThreadCardProvider } from './base-thread-card';
import { BaseThreadCard } from './base-thread-card';
import { ThreadSearchbar, ThreadCommentInput } from '../common';
import { useState, useEffect } from 'react';
import { mockComments } from '../../lib/mock-data';
import { CommentCard } from '../comment-card';

interface ThreadCardProps {
  id: number;
  authorName: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  avatarUrl: string;
  viewThreads: () => void;
  selectedThread?: Thread;
  setSelectedThread?: (thread: Thread) => void | undefined;
  setShowCommentSection?: (show: boolean) => void;
  showCommentSection?: boolean;
}

export const CommentsThreadCard = ({
  id,
  authorName,
  timeAgo,
  content,
  imageUrl,
  likes: initialLikes,
  comments,
  avatarUrl,
  viewThreads,
  selectedThread,
  setSelectedThread,
  setShowCommentSection,
  showCommentSection
}: ThreadCardProps) => {
  const [showCommentSearchbar, setShowCommentSearchbar] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // handle comment click
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setShowCommentSection) {
      setShowCommentSection(!showCommentSection);
    }
    setShowCommentInput(false);
    setShowCommentSearchbar(true);
  };

  const handleCommentSubmit = (comment: string) => {
    // Handle comment submission here
    console.log('New comment:', comment);
    if (setShowCommentSection) {
      setShowCommentSection(false);
    }
    setShowCommentSearchbar(false);
    setShowCommentInput(false);
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
        comments
      });
    }
    viewThreads();
  };

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
        </BaseThreadCard.Header>

        <BaseThreadCard.Content>
          <BaseThreadCard.Text content={content} />
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
            <Bookmark className="h-5 w-5" />
          </button>
        </BaseThreadCard.Actions>

        {showCommentSection && (
          <BaseThreadCard.Comment>
            {mockComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                iconClassName="hover:bg-white/50"
                variant="primary"
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
            variant="secondary"
          />
        )}
        {showCommentSection && showCommentInput && (
          <ThreadCommentInput
            onSubmit={handleCommentSubmit}
            onCancel={() => {
              setShowCommentInput(false);
              setShowCommentSearchbar(true);
            }}
            variant="secondary"
          />
        )}
      </BaseThreadCard>
    </ThreadCardProvider>
  );
};
