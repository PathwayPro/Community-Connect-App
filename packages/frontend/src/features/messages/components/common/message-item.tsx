'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { ChatPreview } from '@/features/messages/types';
import { MessageTimestamp } from './chat-bubble';
import { ImagePreview } from '@/shared/components/image/image-preview';

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
      <Avatar className="size-10 bg-warning-500">
        {chat.picture_upload_link && (
          <ImagePreview
            imagePath={chat.picture_upload_link ?? ''}
            alt={fullName}
            className="h-full w-full object-cover"
            width={40}
            height={40}
            priority={true}
          />
        )}
        {!chat.picture_upload_link && (
          <AvatarFallback>{chat.first_name.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold">{fullName}</p>
          <MessageTimestamp
            timestamp={new Date(chat.last_message)}
            isCurrentUser={false}
          />
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
