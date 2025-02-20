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

interface ThreadInputProps {
  onSubmit?: (content: string, attachments: File[]) => void;
  initialContent?: string;
  className?: string;
}

export const ThreadInput = ({
  onSubmit,
  initialContent = '',
  className
}: ThreadInputProps) => {
  const [content, setContent] = useState(initialContent);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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

  const characterLimit = 1000;
  const remainingCharacters = characterLimit - content.length;
  const isOverLimit = remainingCharacters < 0;

  return (
    <div
      className={cn('space-y-4 rounded-lg border bg-card p-4', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-6">
        <Avatar className="h-11 w-11 bg-warning-500">
          <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="relative flex flex-col">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] resize-none rounded-lg text-base"
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

              <Button
                onClick={handleSubmit}
                className="h-10 w-fit rounded-xl"
                // disabled={
                //   isSubmitting ||
                //   (!content.trim() && attachments.length === 0) ||
                //   isOverLimit
                // }
              >
                Post Thread
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
