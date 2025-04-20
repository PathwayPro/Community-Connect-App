'use client';

import { IconInput } from '@/shared/components/ui/icon-input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { MessagesSquare } from 'lucide-react';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { ChatTabs } from './chat-tabs';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatBubble } from './common/chat-bubble';
import { useState, useEffect } from 'react';
import { useMessageStore } from '../store';

export const Messages = () => {
  const {
    chatList,
    currentChat,
    getChatList,
    getChat,
    selectedUserId,
    setSelectedUserId
  } = useMessageStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getChatList();
  }, [getChatList]);

  useEffect(() => {
    if (selectedUserId) {
      getChat(selectedUserId);
    }
  }, [selectedUserId, getChat]);

  console.log(
    'this is the chat detail :',
    currentChat,
    'chat list :',
    chatList
  );

  const handleChatSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

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
        <ChatTabs
          chatList={chatList}
          searchQuery={searchQuery}
          onChatSelect={handleChatSelect}
          selectedUserId={selectedUserId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedUserId ? (
          <>
            <ChatHeader
              selectedChat={chatList.find(
                (chat) => chat.user_chat === Number(selectedUserId)
              )}
            />
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentChat.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.sender_id !== Number(selectedUserId)}
                  />
                ))}
              </div>
            </ScrollArea>
            <ChatInput
              recipientId={Number(selectedUserId)}
              connectionStatus={
                chatList.find(
                  (chat) => chat.user_chat === Number(selectedUserId)
                )?.connection_status || 'NO_REQUEST'
              }
            />
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
