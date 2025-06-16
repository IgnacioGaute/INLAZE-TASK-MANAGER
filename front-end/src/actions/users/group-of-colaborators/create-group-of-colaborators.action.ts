'use server';

import { groupOfColaboratorsSchema, GroupOfColaboratorsSchemaType } from '@/schemas/group-of-colaborators.schema';
import { createGroupOfColaborators as createGroupOfColaboratorsAPI } from '@/services/users.service'

export async function createGroupOfColaboratorsAction(values: GroupOfColaboratorsSchemaType) {
  const validatedFields = groupOfColaboratorsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const project = await createGroupOfColaboratorsAPI(validatedFields.data);

    if (!project) {
      return { error: 'Error al crear grupo' };
    }
    return { success: 'Grupo creado exitosamente' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al crear grupo' };
  }
}
