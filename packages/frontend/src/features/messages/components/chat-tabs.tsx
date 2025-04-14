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
import { Message } from '@/features/messages/types';

interface ChatTabsProps {
  messages: Message[];
}

export const ChatTabs = ({ messages }: ChatTabsProps) => {
  const hasMessages = messages.length > 0;

  return (
    <Tabs defaultValue="all" className="pt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-4 focus-visible:outline-none">
        <h3 className="px-4 text-sm font-medium text-muted-foreground">
          PAST CHATS
        </h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {hasMessages ? (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          ) : (
            <EmptyStateCard
              icon={MessagesSquare}
              title="No messages yet"
              description="Start a conversation with someone"
              action={{
                label: 'Start Chat',
                onClick: () => {
                  /* Handle new chat */
                }
              }}
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
          <div className="flex h-full flex-1 items-center justify-center p-4">
            <EmptyStateCard
              icon={MessageCircleOff}
              title="No connections yet"
              description="Connect with someone to start a conversation"
            />
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="pending" className="mt-4 focus-visible:outline-none">
        <h3 className="px-4 text-sm font-medium text-muted-foreground">
          PENDING MESSAGES
        </h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="flex h-full flex-1 items-center justify-center p-4">
            <EmptyStateCard
              icon={FileEdit}
              title="No pending messages"
              description="Your pending messages will appear here"
            />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
