import { getAuthHeaders } from "@/lib/auth";
import { getCacheTag } from "./cache-tags";
import { PaginatedResponse } from "@/types/paginated-response.type";
import { revalidateTag } from "next/cache";
import { Task } from "@/types/task.type";
import { TaskSchemaType, TaskStatusSchemaType, UpdateTaskSchemaType } from "@/schemas/task.schema";
import { CommentSchemaType } from "@/schemas/comment.schema";
import { Comment } from "@/types/comment.type";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const getTasks= async (authToken?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: await getAuthHeaders(authToken),
        next: {
          tags: [getCacheTag('tasks', 'all') ],
        },
      });
      const data = await response.json();
  
      if (response.ok) {
        return data as PaginatedResponse<Task>;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  export const getTaskById = async (taskId:string, authToken?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        headers: await getAuthHeaders(authToken),
        next: {
        tags: [getCacheTag('tasks', 'single', taskId)],
      },
      });
      const data = await response.json();
  
      if (response.ok) {
        return data as Task;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

export const createTask = async (
    values: TaskSchemaType, projectId: string, authToken?: string
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${projectId}`, {
        method: 'POST',
        headers: await getAuthHeaders(authToken),
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        revalidateTag(getCacheTag('tasks', 'project', projectId));
        revalidateTag(getCacheTag('tasks', 'projects'));
        revalidateTag(getCacheTag('tasks', 'all'));
        return data as Task;
      } else {
        console.error('Error en la respuesta:', data);
        return null;
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
      return null;
    }
  };

  export const updateTask = async (
    id: string,
    value: Partial<UpdateTaskSchemaType>, authToken?: string
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: await getAuthHeaders(authToken),
        body: JSON.stringify(value),
      });
      const data = await response.json();
  
      if (response.ok) {
        revalidateTag(getCacheTag('tasks', 'all'));
        revalidateTag(getCacheTag('tasks', 'projects'));

        return data as Task;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const deleteTask = async (id: string, authToken?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        headers: await getAuthHeaders(authToken),
        method: 'DELETE',
      });
      const data = await response.json();
  
      if (response.ok) {
        revalidateTag(getCacheTag('tasks', 'all'));
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

  export const updateTaskStatus = async (
  id: string,
  value: Partial<TaskStatusSchemaType>,
  authToken?: string,
) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/status/${id}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(value),
    });

    const data = await response.json();
        revalidateTag(getCacheTag('tasks', 'projects'));
        revalidateTag(getCacheTag('tasks', 'all'));
    if (!response.ok) {
      console.error(data);
      return {
        error: {
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || 'Error desconocido',
        },
      };
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createComment = async (
    values: CommentSchemaType, authToken?: string
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/comments/task`, {
        method: 'POST',
        headers: await getAuthHeaders(authToken),
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        revalidateTag(getCacheTag('tasks', 'all'));
        return data as Comment;
      } else {
        console.error('Error en la respuesta:', data);
        return null;
      }
    } catch (error) {
      console.error('Error al crear comentario:', error);
      return null;
    }
  };
  

