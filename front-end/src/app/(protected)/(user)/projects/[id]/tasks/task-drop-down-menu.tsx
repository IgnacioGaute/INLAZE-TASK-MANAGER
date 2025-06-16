import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MoreVertical } from 'lucide-react';
import { UpdateTaskDialog } from './update-task-dialog';
import { DeleteTaskDialog } from './delete-task-dialog';
import { Task } from '@/types/task.type';
import { User } from '@/types/user.type';
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';

export function TaskDropdownMenu({task, users, groups, onTaskCreated} : {task: Task, users: User[], groups: GroupOfColaborators[], onTaskCreated: () => void}){
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] bg-[#121826]">
            <DropdownMenuLabel className="text-sm">Acciones</DropdownMenuLabel>
            <UpdateTaskDialog task={task} users={users} groups={groups} onTaskCreated={onTaskCreated}/>
            <DeleteTaskDialog task={task} onTaskCreated={onTaskCreated}/>
          </DropdownMenuContent>
        </DropdownMenu>
      );
}