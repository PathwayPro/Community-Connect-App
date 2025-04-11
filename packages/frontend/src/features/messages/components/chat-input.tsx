import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { SmileIcon, PaperclipIcon, Send } from 'lucide-react';

export const ChatInput = () => {
  return (
    <div className="border-t p-4">
      <div className="relative flex items-center gap-2">
        <Input placeholder="Type something..." className="flex-1" />
        <div className="absolute right-0 flex items-center gap-2 pr-2">
          <Button size="icon" variant="ghost">
            <SmileIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Button size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
