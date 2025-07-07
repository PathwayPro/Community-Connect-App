'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Mentee } from '../../types';
import { Badge } from '@/shared/components/ui/badge';
import { AdminMenteeModalCard } from '../common/modals/admin-mentee-modal';

interface MenteeColumnsProps {
  onStatusUpdate?: () => void;
}

export const createMenteeColumns = (
  onStatusUpdate?: () => void
): ColumnDef<Mentee>[] => [
  {
    accessorKey: 'identity.firstName',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Mentee</div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={row.original.identity.avatar}
            alt={`${row.original.identity.firstName} ${row.original.identity.lastName}'s avatar`}
          />
          <AvatarFallback>
            {row.original.identity.firstName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span>
          {row.original.identity.firstName} {row.original.identity.lastName}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'email',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Email</div>
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>
  },
  {
    accessorKey: 'profession',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Profession</div>
    ),
    cell: ({ row }) => <div>{row.getValue('profession')}</div>
  },
  {
    accessorKey: 'experience',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Experience</div>
    ),
    cell: ({ row }) => <div>{row.getValue('experience')}</div>
  },
  {
    accessorKey: 'status',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Status</div>
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          (row.getValue('status') as string).toLowerCase() === 'approved'
            ? 'success'
            : (row.getValue('status') as string).toLowerCase() === 'pending'
              ? 'warning'
              : 'destructive'
        }
        className="h-8 w-[90px] justify-center rounded-full text-sm font-medium text-white"
      >
        {row.getValue('status')}
      </Badge>
    )
  },
  {
    id: 'actions',
    header: () => (
      <div className="text-center font-semibold text-neutral-dark-600">
        Actions
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <AdminMenteeModalCard
          data={row.original}
          onStatusUpdate={onStatusUpdate}
        />
      </div>
    )
  }
];

// Keep the original export for backward compatibility
export const menteesColumns = createMenteeColumns();
