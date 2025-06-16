import { Comment } from "./comment.type";
import { GroupOfColaborators } from "./group-of-colaborators.type";
import { Project } from "./project.type";
import { User } from "./user.type";

export const STATUS_TYPE = ['PENDING', 'DONE'] as const;
export type StatusType = (typeof STATUS_TYPE)[number];

export type Task = {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: StatusType;
  users: User[];
  groupOfColaborators: GroupOfColaborators[];
  project: Project;
  comments: Comment[];
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}