import { Avatar } from '@/shared/components/ui/avatar';
import Image from 'next/image';

export const ChatHeader = () => {
  return (
    <div className="flex items-center gap-3 border-b p-4">
      <Avatar className="size-10 bg-warning-500">
        <Image src="/profile/profile.png" alt="User" width={40} height={40} />
      </Avatar>
      <div>
        <p className="text-paragraph-sm font-normal">Cole Palmer</p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
      </div>
    </div>
  );
};
