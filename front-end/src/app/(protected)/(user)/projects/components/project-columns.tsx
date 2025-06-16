'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Project } from '@/types/project.type';
import { ColumnDef } from '@tanstack/react-table';
import { UpdateProjectDialog } from './update-project-dialog';
import { DeleteProjectDialog } from './delete-project-dialog';
import Link from 'next/link';

export const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => {
      const project = row.original;

      return (
        <Link
          href={{
            pathname: `/projects/${project.id}`
          }}
          className="text-with hover:underline min-w-[100px] text-sm"
        >
          {project.title}
        </Link>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex justify-end items-center gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel className="text-sm">Acciones</DropdownMenuLabel>
            <UpdateProjectDialog project={project} />
            <DeleteProjectDialog project={project} />
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      );
    },
  },
];
