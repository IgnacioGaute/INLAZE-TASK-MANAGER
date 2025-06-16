import { STATUS_TYPE } from '@/types/task.type';
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(2, 'El titulo debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres'),
  description: z.string().min(2, 'La descripcion debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres'),
  date: z.date(),
  status: z.enum(STATUS_TYPE),
  users: z.array(z.string()).optional(),
  groupOfColaborators: z.array(z.string()).optional(),
});

export type TaskSchemaType = z.infer<typeof taskSchema>;


export const updateTaskSchema = z.object({
  title: z.string().min(2, 'El titulo debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres'),
  description: z.string().min(2, 'La descripcion debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres'),
  date: z.date(),
  status: z.enum(STATUS_TYPE),
  users: z.array(z.string()).optional(),
  groupOfColaborators: z.array(z.string()).optional(),
  });
  export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;

export const deleteTaskSchema = z.object({
  confirmation: z.string().min(0, 'Ingrese la confirmación "Eliminar tarea"'),
});
export type DeleteTaskSchemaType = z.infer<typeof deleteTaskSchema>;

export const taskStatusSchema = z.object({
    status: z.enum(STATUS_TYPE),
});
export type TaskStatusSchemaType = z.infer<typeof taskStatusSchema>;