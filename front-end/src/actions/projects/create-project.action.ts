'use server';

import { projectSchema, ProjectSchemaType } from '@/schemas/project.schema';
import { createProject as createProjectAPI } from '@/services/project.service'

export async function createProjectAction(values: ProjectSchemaType) {
  const validatedFields = projectSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const project = await createProjectAPI(validatedFields.data);

    if (!project) {
      return { error: 'Error al crear el proyecto' };
    }
    return { success: 'Proyecto creado exitosamente' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al crear el proyecto' };
  }
}
