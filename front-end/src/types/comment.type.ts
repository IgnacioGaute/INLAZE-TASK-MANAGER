import { Task } from "./task.type";
import { User } from "./user.type";



export type Comment = {
  id: string;
  content: string;
  author: User;
  task: Task;
  createdAt: Date;
}