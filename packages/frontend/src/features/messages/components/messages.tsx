'use client';

import { IconInput } from '@/shared/components/ui/icon-input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { MessagesSquare, AlertCircle } from 'lucide-react';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { ChatTabs } from './chat-tabs';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatBubble } from './common/chat-bubble';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useMessageStore } from '../store';
import { useRouter } from 'next/navigation';

export const Messages = ({ userId }: { userId: string | undefined }) => {
  const {
    chatList,
    currentChat,
    getChatList,
    getChat,
    selectedUserId,
    setSelectedUserId,
    isLoading,
    error
  } = useMessageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Add this ref for scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use refs to track initial load and navigation state
  const initialLoadRef = useRef(true);
  const isNavigatingRef = useRef(false);
  const prevSelectedUserIdRef = useRef<string | null>(selectedUserId);

  // Consolidated effect to handle initial load and URL-based user selection
  useEffect(() => {
    // Initial load of chat list
    if (initialLoadRef.current) {
      getChatList();
      initialLoadRef.current = false;
    }

    // Set selected user from URL param without causing circular updates
    if (userId && userId !== selectedUserId && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      setSelectedUserId(userId);

      // Reset navigation flag after state update is processed
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 0);
    } else if (!userId && selectedUserId && !isNavigatingRef.current) {
      // This is a redirect to /messages without a user ID - maintain the current selection
      // unless explicitly choosing to clear it
      router.push(`/messages/${selectedUserId}`, { scroll: false });
    }
  }, [getChatList, userId, selectedUserId, setSelectedUserId, router]);

  // Fetch chat data when selected user changes
  useEffect(() => {
    if (
      selectedUserId &&
      (prevSelectedUserIdRef.current !== selectedUserId ||
        prevSelectedUserIdRef.current === selectedUserId) &&
      !isNavigatingRef.current
    ) {
      console.log('this is the selectedUserId', selectedUserId);

      prevSelectedUserIdRef.current = selectedUserId;
      getChat(selectedUserId);
    }
  }, [selectedUserId, getChat]);

  // Handle user not found in chat list - memoized to avoid recreating on each render
  const checkUserExists = useCallback(() => {
    if (selectedUserId && chatList.length > 0 && !isLoading) {
      const userExists = chatList.some(
        (chat) => chat.user_chat === Number(selectedUserId)
      );

      if (!userExists) {
        console.log('User not found in chat list, redirecting to messages');
        router.push('/messages');
      }
    }
  }, [chatList, selectedUserId, isLoading, router]);

  console.log('currentChat', currentChat);

  // Check if user exists in separate effect with memoized callback
  useEffect(() => {
    if (!isNavigatingRef.current) {
      checkUserExists();
    }
  }, [checkUserExists]);

  const handleChatSelect = (userId: string) => {
    isNavigatingRef.current = true;
    setSelectedUserId(userId);

    // Use Next.js router for navigation instead of manual history manipulation
    router.push(`/messages/${userId}`, { scroll: false });

    // Reset navigation flag after state update is processed
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 0);
  };

  // Add a scroll to bottom effect when messages change
  useEffect(() => {
    if (messagesEndRef.current && currentChat.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat]);

  // Display loading state
  if (isLoading && chatList.length === 0) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-white p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl bg-white p-4">
        <EmptyStateCard
          icon={AlertCircle}
          title="Could not load messages"
          description={error}
          action={{
            label: 'Try Again',
            onClick: () => {
              initialLoadRef.current = true;
              getChatList();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col rounded-2xl bg-white md:h-screen md:flex-row">
      {/* Sidebar */}
      <div className="h-1/2 w-full overflow-y-auto border-b px-4 md:h-auto md:w-80 md:overflow-visible md:border-b-0 md:border-r md:px-6">
        <div className="mb-4 mt-4 flex items-center gap-2 md:mt-6">
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
      <div className="flex h-1/2 flex-col overflow-y-auto md:h-auto md:flex-1 md:overflow-visible">
        {selectedUserId ? (
          <>
            <ChatHeader
              selectedChat={chatList.find(
                (chat) => chat.user_chat === Number(selectedUserId)
              )}
            />
            <ScrollArea className="flex-1 p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-16 w-2/3 animate-pulse rounded bg-gray-200 ${i % 2 === 0 ? 'ml-auto' : ''}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentChat.length > 0 ? (
                    <>
                      {currentChat.map((message) => (
                        <ChatBubble
                          key={message.id}
                          message={message}
                          isCurrentUser={
                            message.sender_id !== Number(selectedUserId)
                          }
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex justify-center p-8 text-gray-500">
                      Start a conversation by sending a message below
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            <ChatInput
              recipientId={Number(selectedUserId)}
              connectionStatus={
                chatList.find(
                  (chat) => chat.user_chat === Number(selectedUserId)
                )?.connection_status || 'NO_REQUEST'
              }
              lastMessageType={
                chatList.find(
                  (chat) => chat.user_chat === Number(selectedUserId)
                )?.last_message_type || 'MESSAGE'
              }
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
            <EmptyStateCard
              icon={MessagesSquare}
              title="Connect to start a conversation"
              description="Connect with someone first to start a conversation"
            />
          </div>
        )}
      </div>
    </div>
  );
};
