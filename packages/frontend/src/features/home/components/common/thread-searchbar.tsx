import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';
import { ImageIcon, SmileIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ThreadSearchbarProps {
  onCreateThread?: () => void;
}

export const ThreadSearchbar = ({ onCreateThread }: ThreadSearchbarProps) => {
  return (
    <Card className="h-20 p-4">
      <div className="flex items-center gap-6">
        <Avatar className="h-11 w-11 bg-warning-500">
          <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="relative h-12 flex-1 items-center">
          <Button
            className="max-h-12 w-full resize-none rounded-lg bg-muted hover:bg-muted/80 focus:bg-muted/80"
            onClick={onCreateThread}
          >
            <div className="flex w-full justify-start text-muted-foreground">
              Start a Thread
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
