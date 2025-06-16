'use server';

import { deleteGroupOfColaborators as deleteGroupOfColaboratorsAPI } from '@/services/users.service';

export async function deleteGroupOfColaboratorsAction(id: string) {
  try {
    const success = await deleteGroupOfColaboratorsAPI(id);
    if (!success) {
      return { error: 'Error al eliminar el grupo' };
    }
    return { success: 'Grupo eliminado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al eliminar el grupo' };
  }
}
