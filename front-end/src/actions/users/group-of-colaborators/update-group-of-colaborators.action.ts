'use server';

import { UpdateGroupOfColaboratorsSchemaType } from '@/schemas/group-of-colaborators.schema';
import { updateGroupOfColaborators as updateGroupOfColaboratorsAPI } from '@/services/users.service';

export async function updateGroupOfColaboratorsAction(
  id: string,
  values: Partial<UpdateGroupOfColaboratorsSchemaType>,
): Promise<{
  success?: boolean;
  error?: { code?: string; message: string } | string;
}> {
  try {
    const response = await updateGroupOfColaboratorsAPI(id, values);

    if (!response || response.error) {
      const errorCode = response?.error.code || 'UNKNOWN_ERROR';
      let errorMessage = response?.error.message || 'Error desconocido.';

      return {
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    return { success: true };
  } catch (error: unknown) {
    const typedError = error as { message?: string };
    console.error('Error desde el backend:', typedError);

    return {
      error: {
        code: 'SERVER_ERROR',
        message: typedError.message || 'Error inesperado en el servidor.',
      },
    };
  }
}
