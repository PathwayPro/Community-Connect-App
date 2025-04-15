'use client';

import { IconInput } from '@/shared/components/ui/icon-input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { MessagesSquare } from 'lucide-react';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { ChatTabs } from './chat-tabs';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { messages } from '../lib/mock-data/message';
import { ChatBubble } from './common/chat-bubble';
import { useState } from 'react';

export const Messages = () => {
  const hasSelectedChat = true;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen w-full rounded-2xl bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r px-6">
        <div className="relative top-4 mb-4 flex items-center gap-2">
          <IconInput
            leftIcon="search"
            className="w-full rounded-full bg-neutral-light-200"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ChatTabs messages={messages} searchQuery={searchQuery} />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {hasSelectedChat ? (
          <>
            <ChatHeader />
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.isSentByMe}
                    timestamp={message.timestamp}
                  />
                ))}
              </div>
            </ScrollArea>
            <ChatInput />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
            <EmptyStateCard
              icon={MessagesSquare}
              title="Select a conversation"
              description="Choose a chat from the sidebar or start a new conversation"
              action={{
                label: 'Start New Chat',
                onClick: () => {
                  /* Handle new chat */
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
