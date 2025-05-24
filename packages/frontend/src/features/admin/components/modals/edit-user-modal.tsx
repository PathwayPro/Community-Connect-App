import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { FormInput } from '@/shared/components/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdminStore } from '../../store';
import { toast } from 'sonner';

const editUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address')
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export const EditUserModal = ({
  isOpen,
  onClose,
  userId
}: EditUserModalProps) => {
  const { selectedUser, updateUser } = useAdminStore();

  const methods = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: selectedUser?.firstName || '',
      lastName: selectedUser?.lastName || '',
      email: selectedUser?.email || ''
    }
  });

  const onSubmit = async (data: EditUserFormData) => {
    try {
      await updateUser(userId, data);
      toast.success('User updated successfully');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Edit the user&apos;s information.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
              customError={methods.formState.errors.firstName?.message}
              required
            />
            <FormInput
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
              customError={methods.formState.errors.lastName?.message}
              required
            />
            <FormInput
              name="email"
              label="Email"
              placeholder="Enter email"
              customError={methods.formState.errors.email?.message}
              required
            />
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
                type="submit"
                disabled={methods.formState.isSubmitting}
                className="h-10 bg-primary-500"
              >
                {methods.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
