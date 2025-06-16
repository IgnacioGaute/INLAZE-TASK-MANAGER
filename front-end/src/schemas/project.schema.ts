import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'El titulo debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres')
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;


export const updateProjectSchema = z.object({
   title: z.string().min(2, 'El titulo debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres')
  });
  export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;

export const deleteProjectSchema = z.object({
  confirmation: z.string().min(0, 'Ingrese la confirmación "Eliminar proyecto"'),
});
export type DeleteProjectSchemaType = z.infer<typeof deleteProjectSchema>;