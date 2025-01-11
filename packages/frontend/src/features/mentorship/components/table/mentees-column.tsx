'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Mentee } from './data';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';

export const menteesColumns: ColumnDef<Mentee>[] = [
  {
    accessorKey: 'identity.name',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Mentee</div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={row.original.identity.avatar}
            alt={`${row.original.identity.name}'s avatar`}
          />
          <AvatarFallback>
            {row.original.identity.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span>{row.original.identity.name}</span>
      </div>
    )
  },
  {
    accessorKey: 'date',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Last Met</div>
    ),
    cell: ({ row }) => <div className="">{row.getValue('date')}</div>
  },
  {
    accessorKey: 'profession',
    header: () => (
      <div className="font-semibold text-neutral-dark-600">Profession</div>
    ),
    cell: ({ row }) => <div className="">{row.getValue('profession')}</div>
  }
];
