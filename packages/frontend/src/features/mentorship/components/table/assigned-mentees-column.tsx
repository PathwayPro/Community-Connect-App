'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MentorshipAdmin } from '../../types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { AdminMentorModalCard } from '../common/modals/admin-mentor-modal';

export const AssignMenteesColumns: ColumnDef<MentorshipAdmin>[] = [
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
    accessorKey: 'lastSession',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Last Session</div>
    ),
    cell: ({ row }) => <div>{row.getValue('lastSession')}</div>
  },
  {
    accessorKey: 'sessionsBooked',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Sessions Booked</div>
    ),
    cell: ({ row }) => {
      const sessions = row.getValue('sessionsBooked') as number;
      return (
        <div>
          {sessions} {sessions === 1 ? 'session' : 'sessions'}
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => (
      <div className="text-center font-semibold text-neutral-dark-600">
        Actions
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center px-0">
        <AdminMentorModalCard data={row.original} />
      </div>
    )
  }
];
