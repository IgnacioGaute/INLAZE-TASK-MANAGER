'use client';

import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/types/project.type';
import { updateProjectSchema, UpdateProjectSchemaType } from '@/schemas/project.schema';
import { updateProjectAction } from '@/actions/projects/update-project.action';
import { Task } from '@/types/task.type';
import { updateTaskSchema, UpdateTaskSchemaType } from '@/schemas/task.schema';
import { updateTaskAction } from '@/actions/tasks/update-task.action';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { User } from '@/types/user.type';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';


export function UpdateTaskDialog({ task, users, groups, onTaskCreated }: { task: Task , users: User[], groups: GroupOfColaborators[], onTaskCreated: () => void}) {

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateTaskSchemaType>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title || '',
      description: task.description || '',
      date: task.date ? new Date(task.date) : undefined,
      users: task.users?.map(user => user.id)|| [],
      groupOfColaborators: task.groupOfColaborators?.map(groupOfColaborators => groupOfColaborators.id)|| [],
      status: task.status || 'PENDING' 
    },
  });


  const onSubmit = async (values: UpdateTaskSchemaType) => {
    startTransition(async () => {
      const response = await updateTaskAction(task.id, values);
      if (!response.error) {
        toast.success('Tarea actualizada');
        form.reset();
        setOpen(false);
         onTaskCreated(); 
      } else {
        toast.error(response.error);
      }
    });
  };

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
            variant="ghost"
            className="w-full justify-start"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Editar Tarea
          </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Editar Proyecto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuarios asignados</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length
                            ? users
                                .filter((user) => field.value?.includes(user.id))
                                .map((user) => user.firstName)
                                .join(", ")
                            : "Seleccionar usuarios"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-2 max-h-60 overflow-y-auto">
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={user.id}
                              checked={field.value?.includes(user.id)}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                if (isChecked) {
                                  field.onChange([...field.value || [], user.id]);
                                } else {
                                  field.onChange(field.value?.filter((id: string) => id !== user.id));
                                }
                              }}
                            />
                            <label
                              htmlFor={user.id}
                              className="text-sm font-medium leading-none"
                            >
                              {user.firstName} {user.lastName}
                            </label>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupOfColaborators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupos asignados</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length
                            ? groups
                                .filter((group) => field.value?.includes(group.id))
                                .map((group) => group.name)
                                .join(", ")
                            : "Seleccionar grupos"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-2 max-h-60 overflow-y-auto">
                        {groups.map((group) => (
                          <div key={group.id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={group.id}
                              checked={field.value?.includes(group.id)}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                if (isChecked) {
                                  field.onChange([...field.value || [], group.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((id: string) => id !== group.id)
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={group.id}
                              className="text-sm font-medium leading-none"
                            >
                              {group.name}
                            </label>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha límite</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : 'Seleccionar fecha'}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              Editar Tarea
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
