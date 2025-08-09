import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { ImageIcon, SmileIcon, X, Send } from 'lucide-react';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { SharedIcons } from '@/shared/components/icons';
import { cn } from '@/shared/lib/utils';
import { UserProfile } from '@/features/user-profile/types';
import { ImagePreview } from '@/shared/components/image/image-preview';

interface ThreadCommentInputProps {
  onSubmit: (comment: string) => void;
  onCancel: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  user: UserProfile;
}

export const ThreadCommentInput = ({
  onSubmit,
  onCancel,
  className,
  variant = 'primary',
  user
}: ThreadCommentInputProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      onSubmit(comment);
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  //console.log('this is the variant ', variant);

  const characterLimit = 500;
  const remainingCharacters = characterLimit - comment.length;
  const isOverLimit = remainingCharacters < 0;

  return (
    <div
      className={cn(
        'space-y-4 rounded-xl border p-4',
        className,
        variant === 'primary' ? 'bg-white' : 'bg-muted'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start gap-4 sm:gap-6">
        <Avatar className="mb-12 h-10 w-10 bg-warning-500 sm:h-11 sm:w-11">
          {user.pictureUploadLink && (
            <ImagePreview
              imagePath={user.pictureUploadLink}
              alt={user.firstName + ' ' + user.lastName}
              fill={true}
              priority={true}
              className="rounded-full object-cover"
            />
          )}
          {!user.pictureUploadLink && (
            <AvatarFallback className="bg-warning-500 text-sm sm:text-base">
              {user.firstName
                ?.split(' ')
                .map((n) => n[0])
                .join('') || ''}
              {user.lastName
                ?.split(' ')
                .map((n) => n[0])
                .join('') || ''}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="relative flex flex-col">
            <Textarea
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={cn(
                'min-h-[120px] resize-none rounded-lg bg-white text-base sm:min-h-[150px]'
              )}
              maxLength={characterLimit}
            />
            <div className="absolute bottom-14 right-3 flex items-center gap-1 text-xs text-muted-foreground sm:right-4 sm:text-sm">
              <SharedIcons.info className="h-4 w-4" />
              <span className={isOverLimit ? 'text-destructive' : ''}>
                {remainingCharacters} / {characterLimit} characters
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  type="button"
                  className="cursor-not-allowed rounded-md p-1 opacity-50"
                  aria-label="Add image"
                  disabled
                  aria-disabled="true"
                  title="Disabled"
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  className="cursor-not-allowed rounded-md p-1 opacity-50"
                  aria-label="Add emoji"
                  disabled
                  aria-disabled="true"
                  title="Disabled"
                >
                  <SmileIcon className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="h-9 w-9 rounded-full p-0 sm:h-10 sm:w-fit sm:rounded-xl sm:px-4"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Cancel</span>
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="h-9 w-9 rounded-full p-0 sm:h-10 sm:w-fit sm:rounded-xl sm:px-4"
                  disabled={isSubmitting || !comment.trim() || isOverLimit}
                  aria-label="Post comment"
                >
                  <Send className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Post Comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
