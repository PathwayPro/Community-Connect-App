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
import { MentorModalCard, MentorModalCardExpanded } from './mentor-modal-card';

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

  const handleBack = () => {
    setSelectedMentor(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsPastMentorsOpen}
      // className="w-[600px] max-w-[800px] rounded-3xl"
    >
      <DialogContent className="w-[552px] max-w-[552px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {selectedMentor ? 'Mentor Profile' : 'Past Mentors'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedMentor
              ? 'View the mentor profile.'
              : 'View the mentors you have had in the past.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[450px] rounded-2xl bg-neutral-light-300 p-4">
          <div className="flex flex-col gap-4">
            {selectedMentor ? (
              <MentorModalCardExpanded mentor={selectedMentor} />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {mentors.map((mentor) => (
                  <MentorModalCard
                    key={mentor.id}
                    mentor={mentor}
                    onViewProfile={() => handleViewProfile(mentor)}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-4">
          {selectedMentor && (
            <Button variant="outline" className="w-full" onClick={handleBack}>
              Previous
            </Button>
          )}
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
