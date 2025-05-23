import { MessageSquare, Heart, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { Thread } from '../../lib/mock-data';
import { ThreadCardProvider } from './base-thread-card';
import { BaseThreadCard } from './base-thread-card';
import { ThreadSearchbar, ThreadCommentInput } from '../common';
import { useState, useEffect } from 'react';
import { mockComments } from '../../lib/mock-data';
import { CommentCard } from '../comment-card';

import { useBlogStore } from '../../store';
import { PostCommentResponse } from '../../types';
import { cn } from '@/shared/lib/utils';

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
  liked_by_user?: boolean;
  saved_by_user?: boolean;
}

interface CommentCardProps {
  id: number;
  authorUsername: string;
  authorName: string;
  content: string;
  avatarUrl: string;
  timeAgo: string;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
}

const transformCommentResponseToCommentCardProps = (
  response: PostCommentResponse
): CommentCardProps => ({
  id: response.id,
  authorUsername: `${response.user.first_name} ${response.user.last_name}`,
  authorName: `${response.user.first_name} ${response.user.last_name}`,
  content: response.message,
  avatarUrl: '',
  timeAgo: response.created_at
});

export const CommentsThreadCard = ({
  id,
  authorName,
  timeAgo,
  content,
  imageUrl,
  likes: initialLikes,
  comments,
  avatarUrl,
  liked_by_user,
  saved_by_user,
  viewThreads,
  selectedThread,
  setSelectedThread,
  setShowCommentSection,
  showCommentSection
}: ThreadCardProps) => {
  const [showCommentSearchbar, setShowCommentSearchbar] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isLiked, setIsLiked] = useState(liked_by_user);
  const [isSaved, setIsSaved] = useState(saved_by_user);
  const [likes, setLikes] = useState(initialLikes);

  const {
    threadMessages: rawThreadMessages,
    fetchThreadComments,
    createComment,
    toggleLike,
    toggleSave,
    isLoading: commentsLoading,
    error: commentsError
  } = useBlogStore();
  const threadComments: CommentCardProps[] = !rawThreadMessages
    ? []
    : rawThreadMessages.map(transformCommentResponseToCommentCardProps);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (showCommentSection && selectedThread?.id) {
      fetchThreadComments(selectedThread.id);
    }
  }, [showCommentSection, selectedThread?.id, fetchThreadComments]);

  // handle like
  const handleLike = async () => {
    if (!selectedThread?.id) {
      return;
    }
    const like = await toggleLike(selectedThread.id);

    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // handle save
  const handleSave = async () => {
    if (!selectedThread?.id) {
      return;
    }
    const save = await toggleSave(selectedThread.id);

    setIsSaved(!isSaved);
  };

  // handle comment click
  const handleCommentClick = (e: React.MouseEvent) => {
    console.log('COMMENT CLICK');
    e.stopPropagation();
    if (setShowCommentSection) {
      setShowCommentSection(!showCommentSection);
    }
    setShowCommentInput(false);
    setShowCommentSearchbar(true);
  };

  const handleCommentSubmit = async (comment: string) => {
    // Handle comment submission here
    console.log('New comment:', comment);
    console.log('SELECTED THREAD:', selectedThread?.id);

    if (!selectedThread?.id || !content) {
      return;
    }

    const commentSubmit = await createComment(selectedThread.id, comment);

    if (setShowCommentSection) {
      setShowCommentSection(false);
    }
    setShowCommentSearchbar(false);
    setShowCommentInput(false);

    return commentSubmit;
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

        {/* 
          - - - - - - - ORIGINAL - - - - - - - 
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
        )} */}

        {showCommentSection && (
          <BaseThreadCard.Comment>
            {commentsLoading ? (
              <div>Loading comments...</div>
            ) : commentsError ? (
              <div>Error loading comments: {commentsError}</div>
            ) : (
              threadComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  iconClassName="hover:bg-white/50"
                  variant="primary"
                />
              ))
            )}
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
