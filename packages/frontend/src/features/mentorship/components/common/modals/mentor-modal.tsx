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
import { ChevronLeft, MessageSquareIcon, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ProfileData {
  firstName: string;
  lastName: string;
  profession: string;
  email: string;
  avatarUrl: string;
  isMentor: boolean;
  company?: string;
  expertise?: string;
}

interface MentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData | null;
  setIsModalOpen: (open: boolean) => void;
}

export function MentorModal({
  isOpen,
  profileData,
  setIsModalOpen
}: MentorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="flex h-[85dvh] w-[92vw] max-w-[95vw] flex-col rounded-3xl p-4 sm:h-auto sm:w-[552px] sm:max-w-[552px] sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold sm:text-2xl">
            {profileData?.isMentor ? 'Mentor Profile' : 'Mentee Profile'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            View the {profileData?.isMentor ? 'mentor' : 'mentee'} profile.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          className={cn(
            'min-h-0 flex-1 rounded-2xl bg-neutral-light-300 p-3 sm:p-4',
            profileData?.isMentor ? 'h-[60dvh] sm:h-[450px]' : ''
          )}
        >
          <div className="flex flex-col gap-4">
            {profileData && <MentorModalCardExpanded mentor={profileData} />}
          </div>
        </ScrollArea>

        <div className="mt-4 flex gap-4">
          <Button
            variant="outline"
            className="mx-auto h-10 w-full"
            onClick={() => setIsModalOpen(false)}
          >
            <User className="h-4 w-4" />
            View Profile
          </Button>
          <Button
            className="mx-auto h-10 w-full"
            onClick={() => setIsModalOpen(false)}
          >
            {profileData?.isMentor ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <MessageSquareIcon className="h-4 w-4" />
            )}
            {profileData?.isMentor ? 'Back to Dashboard' : 'Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
