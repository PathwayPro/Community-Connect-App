import { Avatar } from '@/shared/components/ui/avatar';
import Image from 'next/image';
import { ChatPreview } from '@/features/messages/types';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface ChatHeaderProps {
  selectedChat?: ChatPreview;
}

export const ChatHeader = ({ selectedChat }: ChatHeaderProps) => {
  if (!selectedChat) return null;

  const fullName = [selectedChat.first_name, selectedChat.last_name]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex items-center gap-3 border-b p-4">
      <Avatar className="size-10 bg-warning-500">
        <Image
          src={selectedChat.picture_upload_link || '/profile/profile.png'}
          alt={fullName}
          width={40}
          height={40}
        />
      </Avatar>
      <div>
        <p className="text-paragraph-sm font-normal">{fullName}</p>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'rounded-full border-none px-2 py-0.5 text-xs',
              selectedChat.connection_status === 'PENDING'
                ? 'bg-warning-100 text-warning-700'
                : 'bg-success-100 text-success-700'
            )}
          >
            {selectedChat.connection_status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {selectedChat.role}
          </span>
        </div>
      </div>
    </div>
  );
};
