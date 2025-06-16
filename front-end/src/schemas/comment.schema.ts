import z from "zod";


export const commentSchema = z.object({
  content: z.string().min(2, 'El mensaje debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres'),
  userId: z.string(),
  taskId: z.string(),
});

export type CommentSchemaType = z.infer<typeof commentSchema>;
