'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { format } from 'date-fns';
import { ChatPreview } from '@/features/messages/types';

interface MessageItemProps {
  chat: ChatPreview;
  isSelected?: boolean;
  onClick: () => void;
}

export const MessageItem = ({
  chat,
  isSelected,
  onClick
}: MessageItemProps) => {
  const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(' ');

  return (
    <div
      className={`flex cursor-pointer items-center gap-2 border-b p-4 last:border-b-0 hover:bg-neutral-100 ${
        isSelected ? 'bg-neutral-100' : ''
      }`}
      onClick={onClick}
    >
      <Avatar className="size-10">
        <AvatarImage src={chat.picture_upload_link || '/profile/profile.png'} />
        <AvatarFallback>{chat.first_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{fullName}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(chat.last_message), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="line-clamp-1 text-paragraph-sm text-muted-foreground">
            {chat.last_message_content}
          </p>
          {chat.connection_status === 'PENDING' && (
            <span className="rounded-full bg-warning-100 px-2 py-0.5 text-xs text-warning-700">
              Pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
