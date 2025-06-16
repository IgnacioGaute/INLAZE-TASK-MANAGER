'use client';

import { useTransition, useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { TaskAccordion } from './task-accordion';
import { User } from '@/types/user.type';
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';
import { Task } from '@/types/task.type';

type TaskListSectionProps = {
  tasks: Task[];
  users: User[];
  groups: GroupOfColaborators[];
  onTaskCreated: () => void;
};

export function TaskListSection({
  tasks,
  users,
  groups,
  onTaskCreated,
}: TaskListSectionProps) {
  const [isPending, startTransition] = useTransition();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');
  const [deadlineFilter, setDeadlineFilter] = useState<Date | undefined>(undefined);
  const [userFilter, setUserFilter] = useState('ALL');

  const parsedTasks: Task[] = tasks.map((task) => ({
    ...task,
    status:
      task.status.toUpperCase() === 'PENDING'
        ? 'PENDING'
        : task.status.toUpperCase() === 'DONE'
        ? 'DONE'
        : 'PENDING',
  }));

  const filteredTasks = parsedTasks.filter((task) => {
    const matchesTitle = task.title.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;

    const matchesDeadline =
      !deadlineFilter ||
      format(new Date(task.date), 'yyyy-MM-dd') === format(deadlineFilter, 'yyyy-MM-dd');

    const matchesUser =
      userFilter === 'ALL' ||
      task.users.some((user) => user.id === userFilter) ||
      task.groupOfColaborators.some((group) =>
        group.users.some((user) => user.id === userFilter)
      );

    return matchesTitle && matchesStatus && matchesDeadline && matchesUser;
  });


  const resetFilters = () => {
    startTransition(() => {
      setSearchText('');
      setStatusFilter('ALL');
      setDeadlineFilter(undefined);
      setUserFilter('ALL');
    });
  };

  return (
    <section className="rounded-xl p-6 shadow-lg space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Buscar por título */}
        <Input
          type="text"
          placeholder="Buscar por título..."
          value={searchText}
          onChange={(e) => startTransition(() => setSearchText(e.target.value))}
        />

        {/* Estado */}
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            startTransition(() => setStatusFilter(value as 'ALL' | 'PENDING' | 'DONE'))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="DONE">Realizado</SelectItem>
          </SelectContent>
        </Select>

        {/* Fecha límite con reset */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full text-left border rounded px-3 py-2 text-sm",
                !deadlineFilter && "text-muted-foreground"
              )}
            >
              {deadlineFilter
                ? format(deadlineFilter, 'PPP')
                : 'Seleccionar fecha'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 space-y-2">
            <Calendar
              mode="single"
              selected={deadlineFilter}
              onSelect={(date) =>
                startTransition(() => setDeadlineFilter(date ?? undefined))
              }
              initialFocus
            />
            {deadlineFilter && (
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => startTransition(() => setDeadlineFilter(undefined))}
              >
                Reiniciar fecha
              </button>
            )}
          </PopoverContent>
        </Popover>

        {/* Responsable */}
        <Select
          value={userFilter}
          onValueChange={(value) => startTransition(() => setUserFilter(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Responsable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los responsables</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={resetFilters}
        >
          Reiniciar filtros
        </button>
      </div>

      {isPending && <p className="text-gray-500">Cargando tareas...</p>}

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-400 italic mt-8">
          No hay tareas que coincidan con los filtros seleccionados.
        </p>
      ) : (
        <TaskAccordion
          tasks={filteredTasks}
          users={users}
          groups={groups}
          onTaskCreated={onTaskCreated}
        />
      )}
    </section>
  );
}
