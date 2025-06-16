'use server';

import { deleteTask as deleteTaskAPI } from '@/services/task.service';

export async function deleteTaskAction(id: string) {
  try {
    const success = await deleteTaskAPI(id);
    if (!success) {
      return { error: 'Error al eliminar la tarea' };
    }
    return { success: 'Tarea eliminada exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al eliminar la tarea' };
  }
}
