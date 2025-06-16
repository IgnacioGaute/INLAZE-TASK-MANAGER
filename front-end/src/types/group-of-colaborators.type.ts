import { User } from "./user.type";



export type GroupOfColaborators = {
    id: string;
    name: string;
    users: User[];
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}