'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Icons } from '@/features/auth/components';

const DELETION_REASONS = [
  'No longer using the service',
  'Privacy concerns',
  'Found a better alternative',
  'Technical issues',
  'Other'
] as const;

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function ReasonModal({
  isOpen,
  onClose,
  onConfirm
}: ReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  const handleConfirm = () => {
    const finalReason =
      selectedReason === 'Other' ? customReason : selectedReason;
    onConfirm(finalReason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl sm:max-w-[598px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            <h4 className="font-semibold">Reason for Deleting the Account</h4>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only text-center">
          Please select a reason for deleting your account. If you have a
          specific
        </DialogDescription>

        <div className="space-y-6 p-4">
          <Select onValueChange={setSelectedReason} value={selectedReason}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a Reason" />
            </SelectTrigger>
            <SelectContent>
              {DELETION_REASONS.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-border"></div>
            <div className="text-sm text-muted-foreground">OR</div>
            <div className="h-[1px] flex-1 bg-border"></div>
          </div>

          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Tell us your reason here"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              maxLength={400}
              className="min-h-[100px]"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icons.info className="h-4 w-4" />
              <span className="text-xs text-muted-foreground">
                Max 400 characters
              </span>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleConfirm}
            disabled={!selectedReason && !customReason}
          >
            Delete Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
