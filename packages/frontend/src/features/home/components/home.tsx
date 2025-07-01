'use client';

import { useEffect, useState } from 'react';
import { HomeSidebar } from './sidebar/home-sidebar';
import { sortOptions, Thread } from '../lib/mock-data';
import { IconButton } from '@/shared/components/ui/icon-button';
import { ThreadSearchbar, SortComponent } from './common';
import {
  ThreadCard,
  ThreadInput,
  CommentsThreadCard,
  TagComponent
} from './main-card';
import { useBlogStore } from '../store';
import { ThreadResponse, NavItemProps } from '../types';
import { useUserStore } from '@/features/user-profile/store';
import { EditThreadModal } from './common/edit-thread-modal';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useRole } from '@/features/user-profile/hooks/useRole';
import { Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/components/ui/dialog';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';

const transformThreadResponseToThread = (response: ThreadResponse): Thread => ({
  id: response.id,
  authorName: response.user.first_name + ' ' + response.user.last_name,
  authorUsername: response.user.first_name,
  authorEmail: response.user.email,
  timeAgo: response.created_at,
  content: response.content,
  avatarUrl: response.user.picture_upload_link || '',
  imageUrl: '',
  likes: response.likes_count || 0,
  comments: response.comments_count || 0,
  liked_by_user: response.liked_by_user || false,
  saved_by_user: response.saved_by_user || false,
  tags: [],
  isSaved: false
});

export const Home = () => {
  const [sort, setSort] = useState<string>('newest');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [activeTab, setActiveTab] = useState<string>('Threads');
  const [activeFilterTab, setActiveFilterTab] = useState<string>('THREADS');
  const [viewThreads, setViewThreads] = useState<boolean>(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showCommentSection, setShowCommentSection] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editThreadContent, setEditThreadContent] = useState('');
  const [editThreadLoading, setEditThreadLoading] = useState(false);
  const [editThreadId, setEditThreadId] = useState<number | null>(null);
  const [selectedThreadIds, setSelectedThreadIds] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [threadsToDelete, setThreadsToDelete] = useState<number[]>([]);
  const { showAlert } = useAlertDialog();
  const { user } = useUserStore();
  const { hasRole } = useRole();
  const isAdmin = hasRole('ADMIN');
  const userId = user?.id;

  const {
    threads: rawThreads,
    fetchThreads,
    createThread,
    isLoading,
    error,
    updateThread
  } = useBlogStore(); // Get threads, loading, and error from store
  const threads: Thread[] = rawThreads.map(transformThreadResponseToThread); // Transform the API response

  useEffect(() => {
    fetchThreads({ filter: activeFilterTab, order_by: sort });
  }, [activeTab, sort, selectedTags, fetchThreads]); // Include fetchThreads in the dependency array

  const handleThreadSubmit = async (content: string, attachments: File[]) => {
    try {
      // Handle the thread submission here
      console.log('Thread submitted:', content, attachments);
      setDraftContent('');
      setIsCreatingThread(true);
      const threadSubmit = await createThread(content);
      if (threadSubmit) {
        fetchThreads({ filter: activeFilterTab, order_by: sort });
      }
      setIsCreatingThread(false);
    } catch (error) {
      console.error('Error submitting thread:', error);
    }
  };

  const handleOutsideClick = () => {
    if (isCreatingThread) {
      setIsCreatingThread(false);
    }
  };

  const handleViewThreads = () => {
    setViewThreads(true);
  };

  console.log('all threads', threads);

  const filteredThreads = threads.filter((thread) => {
    // if (activeTab === 'Tags') {
    //   if (selectedTags.length === 0) return true;
    //   return thread?.tags?.some((tag: string) => selectedTags.includes(tag)); // Adjust if your API returns tags differently
    // } else if (activeTab === 'Saved') {
    //   return thread.isSaved; // Adjust if your API returns saved status
    // }
    return true;
  });

  const handleActiveTab = (tab: NavItemProps) => {
    setActiveFilterTab(tab.filter || 'THREADS');
    setActiveTab(tab.label);
  };

  const handleEditThread = (thread: Thread) => {
    setEditThreadId(thread.id);
    setEditThreadContent(thread.content);
    setIsEditModalOpen(true);
  };

  const handleUpdateThread = async (content: string) => {
    if (!editThreadId) return;
    setEditThreadLoading(true);
    try {
      await updateThread(editThreadId, content);
      await fetchThreads({ filter: activeFilterTab, order_by: sort });
      setIsEditModalOpen(false);
      setEditThreadLoading(false);
      setEditThreadId(null);
      setEditThreadContent('');
    } catch (error) {
      setEditThreadLoading(false);
      // Optionally show error toast here
    }
  };

  console.log('| - - - - - - - > FILTERED THREADS 1: ', filteredThreads);

  // Ownership logic
  const isThreadOwner = (thread: Thread) => thread.authorEmail === user?.email;
  const canSelectThread = (thread: Thread) => isAdmin || isThreadOwner(thread);
  const allOwnedByUser =
    filteredThreads.length > 0 && filteredThreads.every(isThreadOwner);

  // Selection logic
  const visibleThreadIds = filteredThreads
    .filter(canSelectThread)
    .map((t) => t.id);
  const allSelected =
    visibleThreadIds.length > 0 &&
    visibleThreadIds.every((id) => selectedThreadIds.includes(id));
  const someSelected = selectedThreadIds.length > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedThreadIds(visibleThreadIds);
    } else {
      setSelectedThreadIds([]);
    }
  };

  const handleSelectThread = (id: number, checked: boolean) => {
    setSelectedThreadIds((prev) =>
      checked ? [...prev, id] : prev.filter((tid) => tid !== id)
    );
  };

  // Bulk actions (UI only)
  const handleBulkDelete = () => {
    setThreadsToDelete(selectedThreadIds);
    setShowDeleteModal(true);
  };
  const handleBulkFlag = () => {
    setSelectedThreadIds([]);
  };
  const handleBulkBlock = () => {
    setSelectedThreadIds([]);
  };

  // Determine if all selected threads are owned by the user
  const allSelectedOwnedByUser =
    someSelected &&
    selectedThreadIds.every((id) => {
      const thread = filteredThreads.find((t) => t.id === id);
      return thread && isThreadOwner(thread);
    });

  // Show Select All if admin or all visible threads are owned by user
  const showSelectAll = isAdmin || allOwnedByUser;

  // Show bulk bar if admin or (thread creator and all selected are theirs)
  const showBulkBar = someSelected && (isAdmin || allSelectedOwnedByUser);

  // Delete confirmation modal logic
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const deletePromises = threadsToDelete.map((id) =>
      import('../api/blog-api').then((mod) =>
        mod.blogApi
          .deleteThread(id)
          .then((res) => ({ id, success: true }))
          .catch(() => ({ id, success: false }))
      )
    );
    // Wait for all deletions in parallel
    const results = await Promise.all(deletePromises);
    setIsDeleting(false);
    setShowDeleteModal(false);
    setSelectedThreadIds([]);
    fetchThreads({ filter: activeFilterTab, order_by: sort });
    // Count results
    const deleted = results.filter((r) => r.success).length;
    const failed = results.length - deleted;
    if (deleted > 0 && failed === 0) {
      showAlert({
        title: 'Thread(s) Deleted',
        description: `Successfully deleted ${deleted} thread${deleted > 1 ? 's' : ''}.`,
        type: 'success'
      });
    } else if (deleted > 0 && failed > 0) {
      showAlert({
        title: 'Partial Success',
        description: `Deleted ${deleted} thread${deleted > 1 ? 's' : ''}, but failed to delete ${failed}.`,
        type: 'warning'
      });
    } else {
      showAlert({
        title: 'Delete Failed',
        description:
          'Failed to delete the selected thread(s). Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="container-wide px-0" onClick={handleOutsideClick}>
      <div className="grid grid-cols-12 gap-8">
        {/* Left column - 1 part */}
        <div className="sticky top-0 col-span-3 h-fit rounded-2xl border bg-card p-4">
          <HomeSidebar
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />
        </div>

        {/* Middle column */}
        <div className="relative col-span-7 min-h-screen gap-4 overflow-y-auto rounded-2xl border bg-muted bg-neutral-light-100 p-4">
          {viewThreads && selectedThread ? (
            <div className="flex flex-col gap-4">
              <IconButton
                onClick={() => setViewThreads(false)}
                variant="ghost"
                className="flex h-10 w-fit items-center gap-2 text-primary"
                leftIcon="arrowLeft"
                label="Back"
              />
              <CommentsThreadCard
                key={selectedThread.id}
                {...selectedThread}
                selectedThread={selectedThread}
                viewThreads={handleViewThreads}
                setShowCommentSection={setShowCommentSection}
                showCommentSection={showCommentSection}
              />
            </div>
          ) : (
            <>
              {isCreatingThread && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-neutral-light-300/50 px-0" />
              )}

              {isCreatingThread ? (
                <div className="relative z-20">
                  <ThreadInput
                    onSubmit={handleThreadSubmit}
                    initialContent={draftContent}
                    onCancel={() => setIsCreatingThread(false)}
                  />
                </div>
              ) : (
                <ThreadSearchbar
                  onCreateThread={() => setIsCreatingThread(true)}
                />
              )}

              {activeTab === 'Tags' && (
                <TagComponent
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
              )}
              {threads.length > 0 && (
                <div className="mb-10 mt-6 flex items-center justify-end">
                  <SortComponent
                    sort={sort}
                    setSort={setSort}
                    options={sortOptions}
                  />
                </div>
              )}
              {showSelectAll && (
                <div className="mb-8 flex items-center justify-between gap-4 pl-4">
                  {threads.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all threads"
                      />
                      <span className="text-sm font-medium">Select All</span>
                    </div>
                  )}
                  {showBulkBar && (
                    <div className="flex items-center gap-4 rounded-lg bg-white p-2 shadow">
                      <span className="pl-2 text-center font-semibold">
                        {selectedThreadIds.length} selected
                      </span>
                      <Button
                        variant="outline"
                        className="h-10 min-w-24 text-sm"
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                      {/* {isAdmin && (
                        <Button
                          variant="outline"
                          className="h-10 min-w-24 text-sm"
                          onClick={handleBulkFlag}
                        >
                          <FlagIcon className="h-4 w-4" />
                          Flag
                        </Button>
                      )}
                      {isAdmin && (
                        <Button
                          variant="outline"
                          onClick={handleBulkBlock}
                          className="h-10 min-w-24 text-sm text-red-600 hover:bg-red-50 hover:text-red-600"
                        >
                          <CircleOff className="h-4 w-4 text-red-600" />
                          Block User/s
                        </Button>
                      )} */}
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
                  {threadsToDelete.length === 1 ? (
                    <div className="mb-4">
                      <div className="font-semibold">Thread Preview:</div>
                      <div className="mt-2 rounded bg-neutral-100 p-3 text-sm">
                        {(() => {
                          const thread = filteredThreads.find(
                            (t) => t.id === threadsToDelete[0]
                          );
                          if (!thread) return 'Thread not found.';
                          return thread.content.length > 50
                            ? thread.content.slice(0, 50) + '...'
                            : thread.content;
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 text-sm">
                      Are you sure you want to delete{' '}
                      <span className="font-semibold">
                        {threadsToDelete.length}
                      </span>{' '}
                      threads?
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
              {/* Empty State for No Threads */}
              {filteredThreads.length === 0 ? (
                <div className="mt-[200px] flex w-full items-center justify-center">
                  <EmptyStateCard
                    icon={MessageSquare}
                    className="min-h-[400px]"
                    title="No Threads Yet"
                    description="There are no threads to display. Create the first thread to get started!"
                    action={
                      user
                        ? {
                            label: 'Create Thread',
                            onClick: () => setIsCreatingThread(true)
                          }
                        : undefined
                    }
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {filteredThreads.map((thread) => (
                    <ThreadCard
                      key={thread.id}
                      {...thread}
                      viewThreads={handleViewThreads}
                      setSelectedThread={setSelectedThread}
                      setShowCommentSection={setShowCommentSection}
                      isOwner={isThreadOwner(thread)}
                      onEditThread={handleEditThread}
                      showCheckbox={canSelectThread(thread)}
                      selected={selectedThreadIds.includes(thread.id)}
                      onSelect={(checked: boolean) =>
                        canSelectThread(thread) &&
                        handleSelectThread(thread.id, checked)
                      }
                    />
                  ))}
                </div>
              )}
              <EditThreadModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateThread}
                initialContent={editThreadContent}
                loading={editThreadLoading}
              />
            </>
          )}
        </div>

        {/* Right column */}
        {/* <div className="sticky top-0 col-span-3 h-fit rounded-2xl border bg-muted bg-white p-4">
          <HomeInfobar />
        </div> */}
      </div>
    </div>
  );
};
