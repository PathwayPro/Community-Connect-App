import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { ComponentPropsWithoutRef, createContext, useContext } from 'react';
import { transformDateTimeToTimeAgo } from '../../lib/utils';
import { ImagePreview } from '@/shared/components/image/image-preview';

interface BaseThreadCardProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

interface ThreadCardContextValue {
  isExpanded?: boolean;
  onExpandClick?: () => void;
}

const ThreadCardContext = createContext<ThreadCardContextValue>({});

export const BaseThreadCard = ({
  children,
  className,
  ...props
}: BaseThreadCardProps) => {
  return (
    <div
      className={cn(
        'h-fit max-w-full space-y-3 rounded-xl border border-neutral-light-200 bg-white p-4 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

BaseThreadCard.Header = function ThreadCardHeader({
  children,
  className
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex items-start justify-between', className)}>
      {children}
    </div>
  );
};

BaseThreadCard.Author = function ThreadCardAuthor({
  name,
  avatarUrl,
  timeAgo
}: {
  name: string;
  avatarUrl: string;
  timeAgo: string;
}) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-16 w-16 bg-warning-500">
        {avatarUrl && (
          <ImagePreview
            imagePath={avatarUrl}
            alt={name}
            fill={true}
            priority={true}
            className="rounded-full"
          />
        )}
        {!avatarUrl && (
          <AvatarFallback className="bg-warning-500">
            {name
              ?.split(' ')
              .map((n) => n[0])
              .join('') || ''}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-semibold">{name}</span>
        <span className="text-gray-500">
          {transformDateTimeToTimeAgo(timeAgo)}
        </span>
      </div>
    </div>
  );
};

BaseThreadCard.Content = function ThreadCardContent({
  children,
  className
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
};

BaseThreadCard.Text = function ThreadCardText({
  content,
  maxLength = 200
}: {
  content: string;
  maxLength?: number;
}) {
  const { isExpanded, onExpandClick } = useContext(ThreadCardContext);

  return (
    <div className="relative">
      <p className="text-neutral-dark-600">
        {content.length > maxLength && !isExpanded ? (
          <>
            <span className="line-clamp-3">{content}</span>
            <span
              className="cursor-pointer text-primary-200 hover:underline"
              onClick={onExpandClick}
            >
              ...see more
            </span>
          </>
        ) : (
          <span className={!isExpanded ? 'line-clamp-3' : ''}>{content}</span>
        )}
      </p>
    </div>
  );
};

BaseThreadCard.Actions = function ThreadCardActions({
  children,
  className
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex items-center justify-between pt-2', className)}>
      {children}
    </div>
  );
};

BaseThreadCard.Comment = function ThreadCardComment({
  children,
  className
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
};

export const ThreadCardProvider = ThreadCardContext.Provider;
