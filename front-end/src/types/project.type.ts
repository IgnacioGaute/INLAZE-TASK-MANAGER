import { Task } from "./task.type";


export type Project = {
    id: string;
    title: string;
    tasks: Task[]
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}