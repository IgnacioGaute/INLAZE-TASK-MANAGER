'use server';

import { TaskStatusSchemaType } from '@/schemas/task.schema';
import { updateTaskStatus as updateTaskStatusAPI } from '@/services/task.service'

export async function updateTaskStatusAction(
  id: string,
  values: Partial<TaskStatusSchemaType>,
) {
  try {
    const success = await updateTaskStatusAPI(id, values);
    if (!success) {
      return { error: 'Error al editar la tarea' };
    }
    return { success: 'Tarea editada exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al editar la tarea' };
  }
}
