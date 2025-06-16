'use server';

import { UpdateTaskSchemaType } from '@/schemas/task.schema';
import { updateTask as updateTaskAPI } from '@/services/task.service'

export async function updateTaskAction(
  id: string,
  values: Partial<UpdateTaskSchemaType>,
) {
  try {
    const success = await updateTaskAPI(id, values);
    if (!success) {
      return { error: 'Error al editar la tarea' };
    }
    return { success: 'Tarea editada exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al editar la tarea' };
  }
}
