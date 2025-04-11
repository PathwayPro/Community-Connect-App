import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';

interface ChatBubbleProps {
  message: {
    content: string;
    images?: string[];
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  isCurrentUser: boolean;
  timestamp: string;
}

interface Message {
  content: string;
  images?: string[];
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  timestamp: string;
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
  timestamp: string;
  isCurrentUser: boolean;
}) {
  return (
    <span
      className={cn(
        'mt-4 self-end text-xs',
        isCurrentUser ? 'text-white' : 'text-muted-foreground'
      )}
    >
      {format(timestamp, 'h:mm a')}
    </span>
  );
}

export function ChatBubble({
  message,
  isCurrentUser,
  timestamp
}: ChatBubbleProps) {
  const { content, images, sender } = message;
  const hasImages = images && images.length > 0;

  return (
    <div
      className={cn(
        'my-6 flex items-center gap-2',
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.avatar} alt={sender.name} />
        <AvatarFallback>{sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
          {content && (
            <div className="flex flex-col">
              <p
                className={cn(
                  'break-words text-sm',
                  isCurrentUser && 'text-white'
                )}
              >
                {content}
              </p>
              <MessageTimestamp
                timestamp={timestamp}
                isCurrentUser={isCurrentUser}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
