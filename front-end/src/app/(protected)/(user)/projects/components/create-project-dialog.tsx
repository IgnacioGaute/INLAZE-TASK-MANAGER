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
import { projectSchema, ProjectSchemaType } from '@/schemas/project.schema';
import { createProjectAction } from '@/actions/projects/create-project.action';
import { Plus, SquareMIcon } from 'lucide-react';

export function CreateProjectDialog() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: ''
    },
  });

  const onSubmit = (values: ProjectSchemaType) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      createProjectAction(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
          toast.success('Proyecto creado exitosamente');
          form.reset();
          setOpen(false)
        })
        .catch((error) => {
          console.error(error);
          setError('Error al crear el proyecto');
          toast.error(error);
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" onClick={() => setOpen(true)}>
          <Plus className="w-6 h-6"/>
          Proyecto
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Crear Proyecto</DialogTitle>
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
            <Button className="w-full" type="submit" disabled={isPending}>
              Crear Proyecto
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
