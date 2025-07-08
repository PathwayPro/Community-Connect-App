import { MessageSquare, Heart, Bookmark, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { Thread } from '../../lib/mock-data';
import { ThreadCardProvider } from './base-thread-card';
import { BaseThreadCard } from './base-thread-card';
import { ThreadSearchbar, ThreadCommentInput } from '../common';
import { useState, useEffect } from 'react';
import { CommentCard } from '../comment-card';
import { useBlogStore } from '../../store';
import { PostCommentResponse } from '../../types';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useRole } from '@/features/user-profile/hooks/useRole';
import { Button } from '@/shared/components/ui/button';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/components/ui/dialog';
import { blogApi } from '../../api/blog-api';
import { useUserStore } from '@/features/user-profile/store';
import { ImagePreview } from '@/shared/components/image/image-preview';
import { UserProfile } from '@/features/user-profile/types';

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
  likes: number;
  comments: number;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
  parent_id?: number;
  post?: {
    id: number;
    message: string;
    created_at: string;
    published: boolean;
    user: {
      id: number;
      first_name: string;
      middle_name?: string;
      last_name: string;
      email: string;
      picture_upload_link?: string;
    };
  };
  replies?: CommentCardProps[];
}

const transformCommentResponseToCommentCardProps = (
  response: PostCommentResponse
): CommentCardProps => ({
  id: response.id,
  authorUsername: `${response.user.first_name} ${response.user.last_name}`,
  authorName: `${response.user.first_name} ${response.user.last_name}`,
  content: response.message,
  avatarUrl: response.user.picture_upload_link || '',
  timeAgo: response.updated_at,
  likes: response.likes_count || 0,
  comments: response.comments_count || 0,
  liked_by_user: response.liked_by_user || false,
  saved_by_user: response.saved_by_user || false,
  parent_id: response.parent_id,
  post: response.post,
  replies:
    response.replies?.map((reply) => ({
      id: reply.id,
      authorUsername: `${reply.user.first_name} ${reply.user.last_name}`,
      authorName: `${reply.user.first_name} ${reply.user.last_name}`,
      content: reply.message,
      avatarUrl: reply.user.picture_upload_link || '',
      timeAgo: reply.updated_at,
      likes: reply.likes_count || 0,
      comments: reply.comments_count || 0,
      liked_by_user: reply.liked_by_user || false,
      saved_by_user: reply.saved_by_user || false,
      parent_id: reply.parent_id,
      post: reply.post
    })) || []
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
  const [selectedCommentIds, setSelectedCommentIds] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentsToDelete, setCommentsToDelete] = useState<number[]>([]);
  const { showAlert } = useAlertDialog();
  const { hasRole } = useRole();
  const isAdmin = hasRole('ADMIN');
  const { user } = useUserStore();

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
    await toggleLike(selectedThread.id);

    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // handle save
  const handleSave = async () => {
    if (!selectedThread?.id) {
      return;
    }
    await toggleSave(selectedThread.id);

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
    fetchThreadComments(selectedThread.id);
    // if (setShowCommentSection) {
    //   setShowCommentSection(true);
    // }
    // setShowCommentSearchbar(false);
    // setShowCommentInput(false);

    return commentSubmit;
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
        avatarUrl,
        imageUrl: imageUrl || '',
        likes,
        comments
      });
    }
    viewThreads();
  };

  const isCommentOwner = (comment: CommentCardProps) =>
    comment.authorName === user?.firstName + ' ' + user?.lastName;
  const canSelectComment = (comment: CommentCardProps) =>
    isAdmin || isCommentOwner(comment);
  const visibleCommentIds = threadComments
    .filter(canSelectComment)
    .map((c) => c.id);
  const allSelected =
    visibleCommentIds.length > 0 &&
    visibleCommentIds.every((id) => selectedCommentIds.includes(id));
  const someSelected = selectedCommentIds.length > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommentIds(visibleCommentIds);
    } else {
      setSelectedCommentIds([]);
    }
  };
  const handleSelectComment = (id: number, checked: boolean) => {
    setSelectedCommentIds((prev) =>
      checked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };
  const handleBulkDelete = () => {
    setCommentsToDelete(selectedCommentIds);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const deletePromises = commentsToDelete.map((id) =>
      blogApi
        .deleteComment(id)
        .then(() => ({ id, success: true }))
        .catch(() => ({ id, success: false }))
    );
    const results = await Promise.all(deletePromises);
    setIsDeleting(false);
    setShowDeleteModal(false);
    setSelectedCommentIds([]);
    if (selectedThread?.id) fetchThreadComments(selectedThread.id);
    const deleted = results.filter(
      (r: { id: number; success: boolean }) => r.success
    ).length;

    const failed = results.length - deleted;

    if (deleted > 0 && failed === 0) {
      showAlert({
        title: 'Comment(s) Deleted',
        description: `Successfully deleted ${deleted} comment${deleted > 1 ? 's' : ''}.`,
        type: 'success'
      });
    } else if (deleted > 0 && failed > 0) {
      showAlert({
        title: 'Partial Success',
        description: `Deleted ${deleted} comment${deleted > 1 ? 's' : ''}, but failed to delete ${failed}.`,
        type: 'warning'
      });
    } else {
      showAlert({
        title: 'Delete Failed',
        description:
          'Failed to delete the selected comment(s). Please try again.',
        type: 'error'
      });
    }
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
            <ImagePreview
              imagePath={imageUrl}
              alt="Thread content"
              width={710}
              height={437}
              className="w-full rounded-md"
              priority={true}
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

        {/* Comment Selection Bulk Bar */}
        {threadComments.length > 0 &&
          (isAdmin || threadComments.some(isCommentOwner)) && (
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all comments"
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
              {someSelected && (
                <div className="right-0 ml-8 flex items-center gap-2 rounded-lg bg-white p-2 shadow">
                  <span className="font-semibold">
                    {selectedCommentIds.length} selected
                  </span>
                  <Button
                    variant="outline"
                    className="h-10 min-w-24 text-sm hover:text-primary-500"
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            {commentsToDelete.length === 1 ? (
              <div className="mb-4">
                <div className="font-semibold">Comment Preview:</div>
                <div className="mt-2 rounded bg-neutral-100 p-3 text-sm">
                  {(() => {
                    const comment = threadComments.find(
                      (c) => c.id === commentsToDelete[0]
                    );
                    if (!comment) return 'Comment not found.';
                    return comment.content.length > 50
                      ? comment.content.slice(0, 50) + '...'
                      : comment.content;
                  })()}
                </div>
              </div>
            ) : (
              <div className="mb-4 text-sm">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{commentsToDelete.length}</span>{' '}
                comments?
              </div>
            )}
            <DialogFooter className="flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="h-10"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="h-10"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showCommentSection && (
          <BaseThreadCard.Comment>
            {commentsLoading ? (
              <div>Loading comments...</div>
            ) : commentsError ? (
              <div>Error loading comments: {commentsError}</div>
            ) : (
              threadComments.map((comment) => (
                <div key={comment.id} className="flex items-center gap-2">
                  {canSelectComment(comment) && (
                    <Checkbox
                      checked={selectedCommentIds.includes(comment.id)}
                      onCheckedChange={(checked) =>
                        canSelectComment(comment) &&
                        handleSelectComment(comment.id, checked as boolean)
                      }
                      aria-label="Select comment"
                    />
                  )}
                  <CommentCard
                    comment={comment}
                    user={user || ({} as UserProfile)}
                    postId={selectedThread?.id}
                    onRefresh={() => {
                      if (selectedThread?.id) {
                        fetchThreadComments(selectedThread.id);
                      }
                    }}
                  />
                </div>
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
            user={user || ({} as UserProfile)}
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
            user={user || ({} as UserProfile)}
          />
        )}
      </BaseThreadCard>
    </ThreadCardProvider>
  );
};
