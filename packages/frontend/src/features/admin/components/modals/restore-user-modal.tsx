import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { useAdminStore } from '../../store';
import { toast } from 'sonner';
import { useState } from 'react';

interface RestoreUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export const RestoreUserModal = ({
  isOpen,
  onClose,
  userId,
  userName
}: RestoreUserModalProps) => {
  const { restoreUser } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await restoreUser(userId);
      toast.success('User restored successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to restore user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore User</DialogTitle>
          <DialogDescription>
            Restore the user&apos;s account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to restore {userName}? This will reactivate
            their account and allow them to access the system again.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-10 bg-primary-500"
            >
              {isSubmitting ? 'Restoring...' : 'Restore User'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
