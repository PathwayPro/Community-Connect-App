'use client';

import { useEffect, useState } from 'react';
import { HomeInfobar } from './infobar/home-infobar';
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
import { ThreadResponse, PostCommentResponse, NavItemProps } from '../types';
import { useUserStore } from '@/features/user-profile/store';

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
  const { user } = useUserStore();

  const {
    threads: rawThreads,
    fetchThreads,
    createThread,
    isLoading,
    error
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

  console.log('| - - - - - - - > FILTERED THREADS 1: ', filteredThreads);

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
              <div className="mb-10 mt-6 flex items-center justify-end">
                <SortComponent
                  sort={sort}
                  setSort={setSort}
                  options={sortOptions}
                />
              </div>
              <div className="flex flex-col gap-8">
                {filteredThreads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    {...thread}
                    viewThreads={handleViewThreads}
                    setSelectedThread={setSelectedThread}
                    setShowCommentSection={setShowCommentSection}
                    isOwner={thread.authorEmail === user?.email}
                  />
                ))}
              </div>
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
