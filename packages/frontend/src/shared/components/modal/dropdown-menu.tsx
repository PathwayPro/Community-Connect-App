import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

export const DropdownMenuComponent = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical className="h-8 w-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="end">
        <DropdownMenuItem>Approve Request</DropdownMenuItem>
        <DropdownMenuItem>Reject Request</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
