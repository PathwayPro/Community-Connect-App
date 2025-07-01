import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';
import { ImageIcon, SmileIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { ImagePreview } from '@/shared/components/image/image-preview';
import { UserProfile } from '@/features/user-profile/types';

interface ThreadSearchbarProps {
  onCreateThread?: () => void;
  title?: string;
  className?: string;
  inputClassName?: string;
  variant?: 'primary' | 'secondary';
  user: UserProfile;
}

export const ThreadSearchbar = ({
  onCreateThread,
  title = 'Start a Thread',
  className,
  inputClassName,
  variant = 'primary',
  user
}: ThreadSearchbarProps) => {
  return (
    <Card
      className={cn(
        'h-20 p-4',
        className,
        variant === 'primary' ? 'bg-white' : 'border-none bg-muted'
      )}
    >
      <div className="flex items-center gap-6">
        <Avatar className="h-11 w-11 bg-warning-500">
          {user?.pictureUploadLink && (
            <ImagePreview
              imagePath={user?.pictureUploadLink}
              alt={user?.firstName + ' ' + user?.lastName}
              fill={true}
              priority={true}
              className="rounded-full object-cover"
            />
          )}
          {!user?.pictureUploadLink && (
            <AvatarFallback className="bg-warning-500">
              {user?.firstName
                ?.split(' ')
                ?.map((n) => n[0])
                ?.join('') || ''}
              {user?.lastName
                ?.split(' ')
                ?.map((n) => n[0])
                ?.join('') || ''}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="relative h-12 flex-1 items-center">
          <Button
            className={cn(
              'max-h-12 w-full resize-none rounded-lg',
              inputClassName,
              variant === 'primary'
                ? 'bg-muted hover:bg-muted/90'
                : 'bg-white hover:bg-neutral-light-100/90'
            )}
            onClick={onCreateThread}
          >
            <div className="flex w-full justify-start text-muted-foreground">
              {title}
            </div>
          </Button>
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 gap-1">
            <button
              type="button"
              className="rounded-md p-1 hover:bg-muted-foreground/10 focus:outline-none focus:ring-2 focus:ring-muted-foreground/20"
              aria-label="Add image"
            >
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </button>
            <button
              type="button"
              className="rounded-md p-1 hover:bg-muted-foreground/10 focus:outline-none focus:ring-2 focus:ring-muted-foreground/20"
              aria-label="Add emoji"
            >
              <SmileIcon className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
