import { GroupOfColaborators } from "./group-of-colaborators.type";
import { Task } from "./task.type";

export const USER_ROLES = ['USER', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  tasks: Task[]
  groupOfColaborators: GroupOfColaborators[];
  comments: Comment[];
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};
