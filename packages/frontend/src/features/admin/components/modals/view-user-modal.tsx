import { cn } from '@/shared/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { UserRoundIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { useAdminStore } from '../../store/admin-store';
import { AdminUser } from '../../types';
import { Separator } from '@/shared/components/ui/separator';
import { useUserStore } from '@/features/user-profile/store';
import { getSkillLabel } from '@/features/user-profile/lib/utils';
import { useEffect } from 'react';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const getStatusColor = (status: AdminUser['status']) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'DELETED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString();
};

const formatArray = (array: string[] | number[] | undefined) => {
  if (!array || array.length === 0) return '-';
  return array.join(', ');
};

export const ViewUserModal = ({
  isOpen,
  onClose,
  userId
}: ViewUserModalProps) => {
  const { selectedUser } = useAdminStore();
  const { skills, fetchSkills } = useUserStore();

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  if (!selectedUser || selectedUser.id !== userId) {
    return null;
  }

  const user = selectedUser;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[600px] max-w-[600px] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            User Profile
          </DialogTitle>
          <DialogDescription className="sr-only">
            View the user&apos;s complete profile information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 rounded-3xl bg-neutral-light-300 p-4">
          <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-neutral-light-500 bg-white p-6">
            <div
              className={cn(
                'absolute top-0 h-[70px] w-full rounded-t-2xl bg-primary-200'
              )}
            />

            <Avatar className="h-20 w-20 border-4 border-white bg-warning-500">
              <AvatarImage
                src={user.pictureUploadLink}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-full w-full"
              />
              <AvatarFallback>
                <UserRoundIcon className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center gap-2 text-center">
              <h6 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h6>
              <p className="mb-4 text-sm text-neutral-dark-100">
                {user.profession || 'No profession specified'}
              </p>

              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-neutral-dark-100">Status:</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getStatusColor(user.status)}`}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>

            {user.bio && (
              <div className="flex flex-col gap-1 text-center">
                <span className="text-sm font-medium text-neutral-dark-100">
                  Bio
                </span>
                <span className="text-sm text-neutral-dark-600">
                  {user.bio}
                </span>
              </div>
            )}

            <Separator />

            {/* User Details Grid */}
            <div className="w-full space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-dark-100">
                    Email
                  </span>
                  <span className="text-sm text-neutral-dark-600">
                    {user.email}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-dark-100">
                    Role
                  </span>
                  <span className="text-sm text-neutral-dark-600">
                    {user.role}
                  </span>
                </div>

                {user.city && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Location
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {user.city}
                      {user.province && `, ${user.province}`}
                    </span>
                  </div>
                )}

                {user.countryOfOrigin && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Country of Origin
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {user.countryOfOrigin}
                    </span>
                  </div>
                )}

                {user.companyName && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Company
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {user.companyName}
                    </span>
                  </div>
                )}

                {user.experience && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Experience
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {user.experience}
                    </span>
                  </div>
                )}

                {user.workStatus && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Work Status
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {user.workStatus}
                    </span>
                  </div>
                )}

                {user.arrivalInCanada && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Arrival in Canada
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {new Date(user.arrivalInCanada).getFullYear()}
                    </span>
                  </div>
                )}

                {user.activelySearching !== undefined && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Actively Searching
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {user.activelySearching ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}

                {user.languages && user.languages.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Languages
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {formatArray(user.languages)}
                    </span>
                  </div>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-dark-100">
                      Skills
                    </span>
                    <span className="text-sm text-neutral-dark-600">
                      {user.skills
                        .map((skillId: number) =>
                          getSkillLabel(skillId, skills)
                        )
                        .join(', ')}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-dark-100">
                    Last Login
                  </span>
                  <span className="text-sm text-neutral-dark-600">
                    {formatDate(user.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="mx-auto h-10 w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
