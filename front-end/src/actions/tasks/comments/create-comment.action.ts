'use server';

import { commentSchema, CommentSchemaType } from '@/schemas/comment.schema';
import { createComment as createCommentAPI } from '@/services/task.service';

export async function createCommentAction(values: CommentSchemaType) {
  const validatedFields = commentSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const project = await createCommentAPI(validatedFields.data);

    if (!project) {
      return { error: 'Error al crear la tarea' };
    }

    return { success: 'Tarea creada exitosamente' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al crear la tarea' };
  }
}
