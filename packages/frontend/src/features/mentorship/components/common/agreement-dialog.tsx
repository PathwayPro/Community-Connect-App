import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';

interface MentorshipAgreementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hasAgreed: boolean;
  onAgreementChange: (agreed: boolean) => void;
  title: string;
}

const agreementContent = `
  Mentorship Program Agreement

  By agreeing to participate in our mentorship program, you acknowledge and agree to the following terms:

  1. Commitment and Responsibility
     • I will maintain regular communication with my mentee(s)
     • I will honor scheduled mentoring sessions and provide timely notice if changes are needed
     • I will maintain professional conduct and confidentiality in all interactions

  2. Program Guidelines
     • I will provide guidance within my area of expertise
     • I will respect boundaries and maintain appropriate mentor-mentee relationships
     • I will follow the program's structured framework and guidelines

  3. Time Commitment
     • I understand that this is a voluntary commitment
     • I agree to dedicate the specified time as indicated in my availability
     • I will participate in the program for a minimum duration of 3 months

  4. Code of Conduct
     • I will foster an inclusive and respectful learning environment
     • I will not discriminate against any mentee based on their background
     • I will report any concerns or issues to the program administrators

  5. Intellectual Property
     • I will respect intellectual property rights and confidentiality
     • I will not share proprietary information without proper authorization
     • I will obtain necessary permissions before sharing resources

  By checking the box below, I confirm that I have read, understood, and agree to abide by these terms and conditions as a mentor in the program.
`;

export const MentorshipAgreementDialog = ({
  isOpen,
  onOpenChange,
  hasAgreed,
  onAgreementChange,
  title
}: MentorshipAgreementDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-[700px] min-w-[740px]">
        <DialogHeader>
          <DialogTitle>Mentorship Program Agreement - {title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Please read the following terms and conditions carefully before
          agreeing to participate in our mentorship program.
        </DialogDescription>
        <ScrollArea className="h-[480px] w-full rounded-md border p-4">
          <div className="whitespace-pre-line">{agreementContent}</div>
        </ScrollArea>
        <div className="mb-6 flex flex-col gap-6 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreement"
              checked={hasAgreed}
              onCheckedChange={(checked) =>
                onAgreementChange(checked as boolean)
              }
            />
            <label
              htmlFor="agreement"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </label>
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
