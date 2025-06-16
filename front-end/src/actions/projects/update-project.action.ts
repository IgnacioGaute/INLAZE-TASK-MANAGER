'use server';

import { UpdateProjectSchemaType } from '@/schemas/project.schema';
import { updateProject as updateProjectAPI } from '@/services/project.service'

export async function updateProjectAction(
  id: string,
  values: Partial<UpdateProjectSchemaType>,
) {
  try {
    const success = await updateProjectAPI(id, values);
    if (!success) {
      return { error: 'Error al editar el proyecto' };
    }
    return { success: 'Proyecto editado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al editar el proyecto' };
  }
}
