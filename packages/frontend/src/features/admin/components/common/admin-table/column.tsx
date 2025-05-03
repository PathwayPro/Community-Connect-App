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
import { UserProfile } from '@/features/user-profile/types';

const getStatusColor = (status: UserProfile['status']) => {
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

export const columns: ColumnDef<UserProfile>[] = [
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
      return (
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
            <DropdownMenuItem>Edit User</DropdownMenuItem>
            <DropdownMenuItem>Change Role</DropdownMenuItem>
            <DropdownMenuItem>Reset Password</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              {user.status === 'active' ? 'Deactivate' : 'Activate'} User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
