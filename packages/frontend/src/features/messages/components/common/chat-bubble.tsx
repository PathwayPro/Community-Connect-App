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

function MessageTimestamp({
  timestamp,
  isCurrentUser
}: {
  timestamp: Date;
  isCurrentUser: boolean;
}) {
  return (
    <span
      className={cn(
        'mt-4 self-end text-xs',
        isCurrentUser ? 'text-white' : 'text-muted-foreground'
      )}
    >
      {format(new Date(timestamp), 'h:mm a')}
    </span>
  );
}

export function ChatBubble({ message, isCurrentUser }: ChatBubbleProps) {
  const sender = React.useMemo(
    () => ({
      first_name: isCurrentUser
        ? message.recipient_first_name
        : message.sender_first_name,
      last_name: isCurrentUser
        ? message.recipient_last_name
        : message.sender_last_name,
      picture_upload_link: isCurrentUser
        ? message.recipient_picture_upload_link
        : message.sender_picture_upload_link
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
        <AvatarImage
          src={sender.picture_upload_link || '/profile/profile.png'}
          alt={fullName}
        />
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
          <div className="flex flex-col">
            <p
              className={cn(
                'break-words text-sm',
                isCurrentUser && 'text-white'
              )}
            >
              {message.message}
            </p>
            <MessageTimestamp
              timestamp={new Date(message.created_at)}
              isCurrentUser={isCurrentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
