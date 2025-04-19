import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { MessagesSquare, MessageCircleOff, FileEdit } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/shared/components/ui/tabs';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { MessageItem } from './common/message-item';
import { ChatPreview } from '@/features/messages/types';

interface ChatTabsProps {
  chatList: ChatPreview[];
  searchQuery: string;
  onChatSelect: (userId: string) => void;
  selectedUserId: string | null;
}

export const ChatTabs = ({
  chatList,
  searchQuery,
  onChatSelect,
  selectedUserId
}: ChatTabsProps) => {
  const handleChatClick = (userId: string) => {
    onChatSelect(userId);
  };

  const filteredChats = chatList.filter(
    (chat) =>
      chat.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.last_name &&
        chat.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const connectedChats = filteredChats.filter(
    (chat) => chat.connection_status === 'APPROVED'
  );
  const pendingChats = filteredChats.filter(
    (chat) => chat.connection_status === 'PENDING'
  );

  return (
    <Tabs defaultValue="all" className="pt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-4 focus-visible:outline-none">
        <h3 className="px-4 text-sm font-medium text-muted-foreground">
          ALL CHATS
        </h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <MessageItem
                key={chat.user_chat}
                chat={chat}
                isSelected={selectedUserId === String(chat.user_chat)}
                onClick={() => handleChatClick(String(chat.user_chat))}
              />
            ))
          ) : (
            <EmptyStateCard
              icon={MessagesSquare}
              title={searchQuery ? 'No matches found' : 'No messages yet'}
              description={
                searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Start a conversation with someone'
              }
            />
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent
        value="connections"
        className="mt-4 focus-visible:outline-none"
      >
        <h3 className="px-4 text-sm font-medium text-muted-foreground">
          CONNECTIONS
        </h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {connectedChats.length > 0 ? (
            connectedChats.map((chat) => (
              <MessageItem
                key={chat.user_chat}
                chat={chat}
                isSelected={selectedUserId === String(chat.user_chat)}
                onClick={() => handleChatClick(String(chat.user_chat))}
              />
            ))
          ) : (
            <EmptyStateCard
              icon={MessageCircleOff}
              title="No connected chats"
              description="Connect with someone to start a conversation"
            />
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="pending" className="mt-4 focus-visible:outline-none">
        <h3 className="px-4 text-sm font-medium text-muted-foreground">
          PENDING CHATS
        </h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {pendingChats.length > 0 ? (
            pendingChats.map((chat) => (
              <MessageItem
                key={chat.user_chat}
                chat={chat}
                isSelected={selectedUserId === String(chat.user_chat)}
                onClick={() => handleChatClick(String(chat.user_chat))}
              />
            ))
          ) : (
            <EmptyStateCard
              icon={FileEdit}
              title="No pending chats"
              description="Your pending messages will appear here"
            />
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
