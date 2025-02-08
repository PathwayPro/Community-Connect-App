import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { MentorModalCardExpanded } from './mentor-modal-card';

// temporary mentor interface
export interface Mentor {
  id?: number;
  firstName?: string;
  lastName?: string;
  profession?: string;
  company?: string;
  expertise?: string;
  email?: string;
  avatarUrl?: string;
}

interface MentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorData?: Mentor;
  setIsMentorModalOpen: (open: boolean) => void;
}

export function MentorModal({
  isOpen,
  mentorData,
  setIsMentorModalOpen
}: MentorModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsMentorModalOpen}
      // className="w-[600px] max-w-[800px] rounded-3xl"
    >
      <DialogContent className="w-[552px] max-w-[552px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Mentor Profile
          </DialogTitle>
          <DialogDescription className="sr-only">
            View the mentor profile.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[450px] rounded-2xl bg-neutral-light-300 p-4">
          <div className="flex flex-col gap-4">
            {mentorData && <MentorModalCardExpanded mentor={mentorData} />}
          </div>
        </ScrollArea>

        <div className="flex gap-4">
          <Button
            variant="default"
            className="mx-auto w-full"
            onClick={() => setIsMentorModalOpen(false)}
          >
            Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
