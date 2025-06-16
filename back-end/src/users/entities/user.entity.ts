import { GroupOfColaborators } from 'src/users/entities/group-of-colaborators.entity';
import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from 'src/tasks/entities/comment.entity';

export const USER_ROLES = ['USER', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  @Index({ unique: true })
  username: string;

  @Column('varchar', { length: 255 })
  firstName: string;

  @Column('varchar', { length: 255 })
  lastName: string;

  @Column('varchar', { length: 255, unique: true })
  @Index({ unique: true })
  email: string;

  @Column('varchar', { length: 255, nullable: true, select: false })
  password: string | null;

  @Column('enum', { enum: USER_ROLES, default: USER_ROLES[0] })
  role: UserRole;

  @ManyToMany(() => Task, (tasks) => tasks.users, { cascade: true })
  tasks: Task[]

  @ManyToMany(() => GroupOfColaborators, (groupOfColaborators) => groupOfColaborators.users)
  groupOfColaborators: GroupOfColaborators[];

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  comments: Comment[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

