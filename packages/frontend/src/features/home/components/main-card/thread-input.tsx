import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { ImageIcon, SmileIcon, X, Send } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { SharedIcons } from '@/shared/components/icons';
import { cn } from '@/shared/lib/utils';
import { ImagePreview } from '@/shared/components/image/image-preview';
import { UserProfile } from '@/features/user-profile/types';

interface ThreadInputProps {
  onSubmit?: (content: string, attachments: File[]) => void;
  initialContent?: string;
  className?: string;
  onCancel?: () => void;
  user: UserProfile;
}

export const ThreadInput = ({
  onSubmit,
  initialContent = '',
  className,
  onCancel,
  user
}: ThreadInputProps) => {
  const [content, setContent] = useState(initialContent);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    console.log('NEW THREAD SUBMIT');
    if (!content.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    try {
      onSubmit?.(content, attachments);
      setContent('');
      setAttachments([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setAttachments([]);
    onCancel?.();
  };

  const characterLimit = 1000;
  const remainingCharacters = characterLimit - content.length;
  const isOverLimit = remainingCharacters < 0;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'space-y-4 rounded-xl border bg-card p-4 shadow-md',
        className
      )}
    >
      <div className="flex gap-4 sm:gap-6">
        <Avatar className="h-10 w-10 bg-warning-500 sm:h-11 sm:w-11">
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
            <AvatarFallback className="bg-warning-500 text-sm sm:text-base">
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
        <div className="flex-1">
          <div className="relative flex flex-col">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none rounded-lg text-base sm:min-h-[400px]"
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
                  onClick={handleCancel}
                  variant="outline"
                  className="h-9 w-9 rounded-full p-0 sm:h-10 sm:w-fit sm:rounded-xl sm:px-4"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Cancel</span>
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="h-9 w-9 rounded-full p-0 sm:h-10 sm:w-fit sm:rounded-xl sm:px-4"
                  disabled={
                    isSubmitting ||
                    (!content.trim() && attachments.length === 0) ||
                    isOverLimit
                  }
                  aria-label="Post thread"
                >
                  <Send className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Post Thread</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
