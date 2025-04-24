import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import { MessageBubble } from '../../types';
import * as React from 'react';

interface ChatBubbleProps {
  message: MessageBubble;
  isCurrentUser: boolean;
}

function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="mb-2 grid grid-cols-2 gap-2">
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="relative aspect-square overflow-hidden rounded-md"
        >
          <Image
            src={image}
            alt={`Shared image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      ))}
    </div>
  );
}

export function formatMessageTimestamp(timestamp: Date) {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInDays = Math.floor(
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return format(messageDate, 'h:mm a'); // Today: 3:45 PM
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return format(messageDate, 'MMM d, yyyy'); // Mar 17, 2024
  }
}

export function MessageTimestamp({
  timestamp,
  isCurrentUser
}: {
  timestamp: Date;
  isCurrentUser: boolean;
}) {
  return (
    <span
      className={cn(
        'self-start text-xs',
        isCurrentUser ? 'text-white' : 'text-muted-foreground'
      )}
    >
      {formatMessageTimestamp(timestamp)}
    </span>
  );
}

export function ChatBubble({ message, isCurrentUser }: ChatBubbleProps) {
  // Safely extract sender/recipient information with fallbacks
  const sender = React.useMemo(
    () => ({
      first_name: isCurrentUser
        ? message.recipient_first_name || 'User'
        : message.sender_first_name || 'User',
      last_name: isCurrentUser
        ? message.recipient_last_name || ''
        : message.sender_last_name || '',
      picture_upload_link: isCurrentUser
        ? message.recipient_picture_upload_link || '/profile/profile.png'
        : message.sender_picture_upload_link || '/profile/profile.png'
    }),
    [
      isCurrentUser,
      message.recipient_first_name,
      message.recipient_last_name,
      message.recipient_picture_upload_link,
      message.sender_first_name,
      message.sender_last_name,
      message.sender_picture_upload_link
    ]
  );

  const fullName = React.useMemo(
    () => [sender.first_name, sender.last_name].filter(Boolean).join(' '),
    [sender.first_name, sender.last_name]
  );

  // Convert timestamp to Date object safely
  const messageDate = message.created_at
    ? new Date(message.created_at)
    : new Date();

  // Assuming message attachments would be handled separately in the future
  const hasImages = false; // For now, no image handling
  const images: string[] = []; // For future implementation

  return (
    <div
      key={`${message.id}-${isCurrentUser ? 'current' : 'other'}`}
      className={cn(
        'my-6 flex items-center gap-2',
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.picture_upload_link} alt={fullName} />
        <AvatarFallback>{sender.first_name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'flex max-w-[70%] flex-col',
          isCurrentUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-lg p-3',
            isCurrentUser ? 'bg-primary-300' : 'bg-muted',
            !hasImages && 'max-w-sm'
          )}
        >
          {hasImages && <ImageGallery images={images} />}
          <div className="flex flex-col gap-2">
            <p
              className={cn(
                'break-words text-sm',
                isCurrentUser && 'text-white'
              )}
            >
              {message.message}
            </p>
            <MessageTimestamp
              timestamp={messageDate}
              isCurrentUser={isCurrentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
