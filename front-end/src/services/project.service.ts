import { getAuthHeaders } from "@/lib/auth";
import { getCacheTag } from "./cache-tags";
import { PaginatedResponse } from "@/types/paginated-response.type";
import { Project } from "@/types/project.type";
import { ProjectSchemaType, UpdateProjectSchemaType } from "@/schemas/project.schema";
import { revalidateTag } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const getProjects= async (authToken?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        headers: await getAuthHeaders(authToken),
        next: {
          tags: [getCacheTag('tasks', 'projects')],
        },
      });
      const data = await response.json();
  
      if (response.ok) {
        return data as PaginatedResponse<Project>;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  export const getProjectById = async (projectId:string, authToken?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
        headers: await getAuthHeaders(authToken),
        next: {
          tags: [getCacheTag('tasks', 'project', projectId)],
        },
      });
      const data = await response.json();
  
      if (response.ok) {
        return data as Project;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

export const createProject = async (
    values: ProjectSchemaType, authToken?: string
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: await getAuthHeaders(authToken),
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        revalidateTag(getCacheTag('tasks', 'projects'));
        return data as Project;
      } else {
        console.error('Error en la respuesta:', data);
        return null;
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      return null;
    }
  };

  export const updateProject = async (
    id: string,
    value: Partial<UpdateProjectSchemaType>, authToken?: string
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: await getAuthHeaders(authToken),
        body: JSON.stringify(value),
      });
      const data = await response.json();
  
      if (response.ok) {
        revalidateTag(getCacheTag('tasks', 'projects'));
        return data as Project;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const deleteProject = async (id: string, authToken?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/projects/${id}`, {
        headers: await getAuthHeaders(authToken),
        method: 'DELETE',
      });
      const data = await response.json();
  
      if (response.ok) {
        revalidateTag(getCacheTag('tasks', 'projects'));
        return data;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  

