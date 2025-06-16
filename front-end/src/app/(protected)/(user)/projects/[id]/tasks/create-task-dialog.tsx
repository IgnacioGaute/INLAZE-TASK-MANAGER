'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Plus } from 'lucide-react';
import { taskSchema, TaskSchemaType } from '@/schemas/task.schema';
import { createTaskAction } from '@/actions/tasks/create-task.action';
import { User } from '@/types/user.type';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';
import { useRouter, usePathname } from 'next/navigation';


export function CreateTaskDialog({projectId, users, groups, onTaskCreated } : {projectId: string , users: User[], groups: GroupOfColaborators[], onTaskCreated: () => void}) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      date: undefined,
      users: [],
      groupOfColaborators: [],
      status: 'PENDING' 
    },
  });

const onSubmit = (values: TaskSchemaType) => {
  setError(undefined);
  setSuccess(undefined);

  startTransition(() => {
    createTaskAction(values, projectId)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
          return;
        }

        setSuccess(data.success);
        toast.success('Tarea creada exitosamente');
        form.reset();
        setOpen(false);
        onTaskCreated(); 
      })
      .catch((error) => {
        console.error(error);
        setError('Error al crear la tarea');
        toast.error('Error al crear la tarea');
      });
  });
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" onClick={() => setOpen(true)}>
          <Plus className="w-6 h-6"/>
          Tarea
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Crear Tarea</DialogTitle>
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
                                .map((user) => user.firstName + ' ' + user.lastName)
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
              Crear Tarea
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
