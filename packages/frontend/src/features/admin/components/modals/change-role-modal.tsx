import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { useAdminStore } from '../../store';
import { toast } from 'sonner';
import { useState } from 'react';
import { UserRole } from '../../types';

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export const ChangeRoleModal = ({
  isOpen,
  onClose,
  userId
}: ChangeRoleModalProps) => {
  const { selectedUser, updateUserRole } = useAdminStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    selectedUser?.role || 'USER'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateUserRole(userId, selectedRole);
      toast.success('User role updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Change the role of the user to the selected role.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MENTOR">Mentor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
