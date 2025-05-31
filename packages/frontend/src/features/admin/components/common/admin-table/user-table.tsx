import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useColumns } from './column';
import { AdminUser } from '../../../types';
import { useState } from 'react';
import { useAdminStore } from '../../../store/admin-store';
import { EditUserModal } from '../../modals/edit-user-modal';
import { ChangeRoleModal } from '../../modals/change-role-modal';
import { RestoreUserModal } from '../../modals/restore-user-modal';
import { DeleteModal } from '@/shared/components/modal/delete-modal';
import { ViewUserModal } from '../../modals/view-user-modal';
import { toast } from 'sonner';
import { ForgotPasswordCredentials } from '@/features/auth/types';

interface UsersTableProps {
  users: AdminUser[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  const { setSelectedUser, resetUserPassword, deleteUser, selectedUser } =
    useAdminStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangeRole = (user: AdminUser) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleRestoreUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsRestoreModalOpen(true);
  };

  const handleResetPassword = (user: AdminUser) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user');
    }
  };

  const confirmResetPassword = async () => {
    if (!selectedUser) return;

    try {
      await resetUserPassword({
        email: selectedUser.email
      } as ForgotPasswordCredentials);
      toast.success('Password reset email sent successfully');
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to send password reset email');
    }
  };

  const columns = useColumns({
    onViewUser: handleViewUser,
    onEditUser: handleEditUser,
    onChangeRole: handleChangeRole,
    onDeleteUser: handleDeleteUser,
    onRestoreUser: handleRestoreUser,
    onResetPassword: handleResetPassword
  });

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Single set of modals - only rendered once when selectedUser exists */}
      {selectedUser && (
        <>
          <ViewUserModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            userId={selectedUser.id}
          />
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userId={selectedUser.id}
          />
          <ChangeRoleModal
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            userId={selectedUser.id}
          />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteUser}
            isDeleting={false}
            title="Delete User"
            description={`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`}
          />
          <RestoreUserModal
            isOpen={isRestoreModalOpen}
            onClose={() => setIsRestoreModalOpen(false)}
            userId={selectedUser.id}
            userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
          />
          <DeleteModal
            isOpen={isResetPasswordModalOpen}
            onClose={() => setIsResetPasswordModalOpen(false)}
            onConfirm={confirmResetPassword}
            isDeleting={false}
            title="Reset Password"
            description={`Are you sure you want to send a password reset link to ${selectedUser.firstName} ${selectedUser.lastName}? They will receive an email with instructions to reset their password.`}
          />
        </>
      )}
    </>
  );
};
