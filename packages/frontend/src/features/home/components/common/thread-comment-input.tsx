import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { ImageIcon, SmileIcon } from 'lucide-react';
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
      <div className="flex items-center gap-6">
        <Avatar className="mb-12 h-11 w-11 bg-warning-500">
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
            <AvatarFallback className="bg-warning-500">
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
                'min-h-[150px] resize-none rounded-lg bg-white text-base'
              )}
              maxLength={characterLimit}
            />
            <div className="absolute bottom-14 right-4 flex items-center gap-1 text-sm text-muted-foreground">
              <SharedIcons.info className="h-4 w-4" />
              <span className={isOverLimit ? 'text-destructive' : ''}>
                {remainingCharacters} / {characterLimit} characters
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1">
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="h-10 w-fit rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="h-10 w-fit rounded-xl"
                  disabled={isSubmitting || !comment.trim() || isOverLimit}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
