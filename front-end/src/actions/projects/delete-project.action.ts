'use server';

import { deleteProject as deleteProjectAPI } from '@/services/project.service';

export async function deleteProjectAction(id: string) {
  try {
    const success = await deleteProjectAPI(id);
    if (!success) {
      return { error: 'Error al eliminar el proyecto' };
    }
    return { success: 'Proyecto eliminado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al eliminar el proyecto' };
  }
}
