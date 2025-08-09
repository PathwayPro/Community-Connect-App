import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useState } from 'react';
import { MentorModalCard } from './mentor-modal-card';

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
  isMentor?: boolean;
}

interface PastMentorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentors: Mentor[];
  setIsPastMentorsOpen: (open: boolean) => void;
}

export function PastMentorsModal({
  isOpen,
  mentors,
  setIsPastMentorsOpen
}: PastMentorsModalProps) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const handleViewProfile = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsPastMentorsOpen}>
      <DialogContent className="flex h-[85dvh] w-[92vw] max-w-[95vw] flex-col rounded-3xl p-4 sm:h-auto sm:w-[552px] sm:max-w-[552px] sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold sm:text-2xl">
            Past Mentors
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedMentor
              ? 'View the mentor profile.'
              : 'View the mentors you have had in the past.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60dvh] rounded-2xl bg-neutral-light-300 p-3 sm:h-[450px] sm:p-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              {mentors.map((mentor) => (
                <MentorModalCard
                  key={mentor.id}
                  mentor={mentor}
                  onViewProfile={() => handleViewProfile(mentor)}
                />
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-4">
          <Button
            variant="default"
            className="mx-auto w-full"
            onClick={() => setIsPastMentorsOpen(false)}
          >
            Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
