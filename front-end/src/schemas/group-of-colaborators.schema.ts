import { z } from 'zod';

export const groupOfColaboratorsSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres'),
  users: z.array(z.string()).min(1, 'Selecciona al menos un usuario'),
});

export type GroupOfColaboratorsSchemaType = z.infer<typeof groupOfColaboratorsSchema>;


export const updateGroupOfColaboratorsSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(650, 'Máximo 650 caracteres'),
  users: z.array(z.string()).min(1, 'Selecciona al menos un usuario'),
  });
  export type UpdateGroupOfColaboratorsSchemaType = z.infer<typeof updateGroupOfColaboratorsSchema>;

export const deleteGroupOfColaboratorsSchema = z.object({
  confirmation: z.string().min(0, 'Ingrese la confirmación "Eliminar grupo"'),
});
export type DeleteGroupOfColaboratorsSchemaType = z.infer<typeof deleteGroupOfColaboratorsSchema>;