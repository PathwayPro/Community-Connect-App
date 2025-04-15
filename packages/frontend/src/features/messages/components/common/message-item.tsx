'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { format } from 'date-fns';
import { Message } from '@/features/messages/types';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-2 border-b p-4 last:border-b-0 hover:bg-neutral-100"
      onClick={handleClick}
    >
      <Avatar className="size-10">
        <AvatarImage src={message.sender.avatar} />
        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{message.sender.name}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(message.timestamp), 'MMM d, yyyy')}
          </p>
        </div>

        <p className="line-clamp-1 text-paragraph-sm text-muted-foreground">
          {message.content}
        </p>
      </div>
    </div>
  );
};
