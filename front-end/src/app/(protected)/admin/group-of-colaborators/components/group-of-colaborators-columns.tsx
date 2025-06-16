'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { BadgeCheckIcon, BadgeXIcon, MoreHorizontal } from 'lucide-react';
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';
import { User } from '@/types/user.type';
import { GroupUsersDialog } from './group-users-dialog';
import { UpdateGroupOfColaboratorsDialog } from './update-group-of-colaboratrs-dialog';
import { DeleteGroupOfColaboratorsDialog } from './delete-group-of-colaborators-dialog';
export const groupOfColaboratorsColumns = (users: User[]): ColumnDef<GroupOfColaborators>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] text-sm">{row.getValue('name')}</div>
    ),
  },
{
  id: 'actions',
  cell: ({ row }) => {
    const groupOfColaborators = row.original;

    return (
      <div className="flex justify-end items-center gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel className="text-sm">Acciones</DropdownMenuLabel>
             <GroupUsersDialog groupId={groupOfColaborators.id} />
             <UpdateGroupOfColaboratorsDialog group={groupOfColaborators} users={users}/>
             <DeleteGroupOfColaboratorsDialog group={groupOfColaborators}/>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
},

];