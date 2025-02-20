'use client';

import { useState } from 'react';
import { HomeInfobar } from './infobar/home-infobar';
import { HomeSidebar } from './sidebar/home-sidebar';
import {
  SortComponent,
  ThreadSearchbar,
  ThreadCard,
  ThreadInput
} from './common';
import { mockThreads, sortOptions } from '../lib/mock-data';

export const Home = () => {
  const [sort, setSort] = useState<string>('newest');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [draftContent, setDraftContent] = useState('');

  const handleThreadSubmit = async (content: string, attachments: File[]) => {
    try {
      // Handle the thread submission here
      console.log('Thread submitted:', content, attachments);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setDraftContent('');
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

  return (
    <div className="container-wide px-0" onClick={handleOutsideClick}>
      <div className="grid grid-cols-12 gap-8">
        {/* Left column - 1 part */}
        <div className="sticky top-0 col-span-3 h-fit rounded-2xl border bg-card p-4">
          <HomeSidebar />
        </div>

        {/* Middle column */}
        <div className="relative col-span-6 min-h-screen gap-4 overflow-y-auto rounded-2xl border bg-muted bg-neutral-light-100 p-4">
          {isCreatingThread && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-neutral-light-300/50 px-0"></div>
          )}
          {isCreatingThread ? (
            <div className="relative z-20">
              <ThreadInput
                onSubmit={handleThreadSubmit}
                initialContent={draftContent}
              />
            </div>
          ) : (
            <ThreadSearchbar onCreateThread={() => setIsCreatingThread(true)} />
          )}

          <div className="mb-10 mt-3 flex items-center justify-end">
            <SortComponent
              sort={sort}
              setSort={setSort}
              options={sortOptions}
            />
          </div>
          <div className="flex flex-col gap-8">
            {mockThreads.map((thread) => (
              <ThreadCard key={thread.id} {...thread} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="sticky top-0 col-span-3 h-fit rounded-2xl border bg-muted bg-white p-4">
          <HomeInfobar />
        </div>
      </div>
    </div>
  );
};
