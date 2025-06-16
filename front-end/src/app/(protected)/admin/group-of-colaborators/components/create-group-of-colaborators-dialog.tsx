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
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { groupOfColaboratorsSchema, GroupOfColaboratorsSchemaType } from '@/schemas/group-of-colaborators.schema';
import { createGroupOfColaboratorsAction } from '@/actions/users/group-of-colaborators/create-group-of-colaborators.action';
import { User } from '@/types/user.type';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export function CreateGroupOfColaboratorsDialog({ users } : {users: User[]}) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<GroupOfColaboratorsSchemaType>({
    resolver: zodResolver(groupOfColaboratorsSchema),
    defaultValues: {
      name: '',
      users: []
    },
  });

  const onSubmit = (values: GroupOfColaboratorsSchemaType) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      createGroupOfColaboratorsAction(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
          toast.success('Grupo creado exitosamente');
          setOpen(false);
        })
        .catch((error) => {
          console.error(error);
          setError('Error al crear grupo');
          toast.error(error);
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" onClick={() => setOpen(true)}>
          Crear Grupo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Crear Grupo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
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
                            .filter((user) => field.value.includes(user.id))
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
          <Button className="w-full" type="submit" disabled={isPending}>
            Crear Grupo
          </Button>
        </form>
      </Form>
      </DialogContent>
    </Dialog>
  );
}

