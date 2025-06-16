'use server';

import { taskSchema, TaskSchemaType } from '@/schemas/task.schema';
import { createTask as createTaskAPI } from '@/services/task.service';

export async function createTaskAction(values: TaskSchemaType, projectId: string) {
  const validatedFields = taskSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const project = await createTaskAPI(validatedFields.data, projectId);

    if (!project) {
      return { error: 'Error al crear la tarea' };
    }

    return { success: 'Tarea creada exitosamente' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al crear la tarea' };
  }
}
