'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Sessions } from './data';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';

export const sessionsColumns: ColumnDef<Sessions>[] = [
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
  },
  {
    id: 'actions',
    header: () => (
      <div className="text-center font-semibold text-neutral-dark-600">
        Join Call
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="h-10 w-[90px] rounded-xl border border-primary-400 text-base font-medium text-primary-400"
          onClick={() => {
            // TODO: Implement call joining logic
            console.log('Joining call with:', row.original.identity.name);
          }}
        >
          Join
        </Button>
      </div>
    )
  }
];
