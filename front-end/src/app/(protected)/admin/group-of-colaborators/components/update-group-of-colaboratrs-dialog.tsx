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
import { updateProjectSchema, UpdateProjectSchemaType } from '@/schemas/project.schema';
import { updateProjectAction } from '@/actions/projects/update-project.action';
import { GroupOfColaborators } from '@/types/group-of-colaborators.type';
import { updateGroupOfColaboratorsSchema, UpdateGroupOfColaboratorsSchemaType } from '@/schemas/group-of-colaborators.schema';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { updateGroupOfColaboratorsAction } from '@/actions/users/group-of-colaborators/update-group-of-colaborators.action';
import { Input } from '@/components/ui/input';
import { User } from '@/types/user.type';


export function UpdateGroupOfColaboratorsDialog({ group, users }: { group: GroupOfColaborators, users: User[] }) {

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateGroupOfColaboratorsSchemaType>({
    resolver: zodResolver(updateGroupOfColaboratorsSchema),
    defaultValues: {
      name: group.name || '',
      users: group.users?.map(user => user.id)|| [],
    },
  });


  const onSubmit = async (values: UpdateGroupOfColaboratorsSchemaType) => {
    startTransition(async () => {
      const response = await updateGroupOfColaboratorsAction(group.id, values);
      if (response.error) {
        const errorMessage =
          typeof response.error === 'string'
            ? response.error
            : response.error.message;

        toast.error(errorMessage);
      } else if (response.success) {
        toast.success('Grupo actualizado exitosamente');
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
            Editar Grupo
          </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Editar Grupo</DialogTitle>
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
            Editar Grupo
          </Button>
        </form>
      </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
