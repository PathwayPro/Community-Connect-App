import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/shared/components/ui/avatar';
import { AdminUser } from '../../../types';
import { useAdminStore } from '../../../store/admin-store';
import { useState } from 'react';
import { EditUserModal } from '../../modals/edit-user-modal';
import { ChangeRoleModal } from '../../modals/change-role-modal';
import { RestoreUserModal } from '../../modals/restore-user-modal';
import { toast } from 'sonner';
import { ForgotPasswordCredentials } from '@/features/auth/types';
import { DeleteModal } from '@/shared/components/modal/delete-modal';
import { useAuthContext } from '@/features/auth/providers/auth-context';
import { ViewUserModal } from '../../modals/view-user-modal';

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

const formatDate = (dateString: string) => {
  if (dateString === '-') return '-';
  return new Date(dateString).toLocaleString();
};

export const useColumns = () => {
  const { setSelectedUser, resetUserPassword, deleteUser } = useAdminStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { user: currentUser } = useAuthContext();

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setIsEditModalOpen(true);
  };

  const handleChangeRole = (user: AdminUser) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setIsRoleModalOpen(true);
  };

  const handleResetPassword = async (user: AdminUser) => {
    try {
      await resetUserPassword({
        email: user.email
      } as ForgotPasswordCredentials);
      toast.success('Password reset email sent successfully');
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to send password reset email');
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    try {
      await deleteUser(user.id);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user');
    }
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 bg-warning-500">
              <AvatarImage src={user.pictureUploadLink} alt={user.firstName} />
              <AvatarFallback>
                {user.firstName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{user.firstName + ' ' + user.lastName}</span>
              <span className="text-muted-foreground">{user.profession}</span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'role',
      header: 'Role'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status || 'inactive';
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs ${getStatusColor(status)}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => row.original.city || '-'
    },
    {
      accessorKey: 'province',
      header: 'Province',
      cell: ({ row }) => row.original.province || '-'
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      cell: ({ row }) => row.original.companyName || '-'
    },
    {
      accessorKey: 'experience',
      header: 'Experience',
      cell: ({ row }) => row.original.experience || '-'
    },
    {
      accessorKey: 'workStatus',
      header: 'Work Status',
      cell: ({ row }) => row.original.workStatus || '-'
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => {
        const lastLogin = row.original.lastLogin || null;

        if (lastLogin === null || lastLogin === undefined) return '-';

        return formatDate(lastLogin);
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = currentUser?.id === user.id;
        const isDeleted = user.status === 'DELETED';

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleViewUser(user)}
                  disabled={isDeleted}
                >
                  View User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEditUser(user)}
                  disabled={isDeleted}
                >
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleChangeRole(user)}
                  disabled={isDeleted}
                >
                  Change Role
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedUserId(user.id);
                    setIsResetPasswordModalOpen(true);
                  }}
                  disabled={isDeleted}
                >
                  Reset Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isDeleted ? (
                  <DropdownMenuItem
                    className="text-green-600"
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedUserId(user.id);
                      setIsRestoreModalOpen(true);
                    }}
                  >
                    Restore User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      if (isCurrentUser) {
                        toast.error('You cannot delete your own account');
                        return;
                      }
                      setSelectedUser(user);
                      setSelectedUserId(user.id);
                      setIsDeleteModalOpen(true);
                    }}
                    disabled={isCurrentUser}
                  >
                    Delete User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedUserId === user.id && (
              <>
                <ViewUserModal
                  isOpen={isViewModalOpen}
                  onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedUserId(null);
                  }}
                  userId={user.id}
                />
                <EditUserModal
                  isOpen={isEditModalOpen}
                  onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUserId(null);
                  }}
                  userId={user.id}
                />
                <ChangeRoleModal
                  isOpen={isRoleModalOpen}
                  onClose={() => {
                    setIsRoleModalOpen(false);
                    setSelectedUserId(null);
                  }}
                  userId={user.id}
                />
                <DeleteModal
                  isOpen={isDeleteModalOpen}
                  onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUserId(null);
                  }}
                  onConfirm={() => handleDeleteUser(user)}
                  isDeleting={false}
                  title="Delete User"
                  description={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
                />
                <RestoreUserModal
                  isOpen={isRestoreModalOpen}
                  onClose={() => {
                    setIsRestoreModalOpen(false);
                    setSelectedUserId(null);
                  }}
                  userId={user.id}
                  userName={`${user.firstName} ${user.lastName}`}
                />
                <DeleteModal
                  isOpen={isResetPasswordModalOpen}
                  onClose={() => {
                    setIsResetPasswordModalOpen(false);
                    setSelectedUserId(null);
                  }}
                  onConfirm={() => handleResetPassword(user)}
                  isDeleting={false}
                  title="Reset Password"
                  description={`Are you sure you want to send a password reset link to ${user.firstName} ${user.lastName}? They will receive an email with instructions to reset their password.`}
                />
              </>
            )}
          </>
        );
      }
    }
  ];

  return columns;
};
