import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { GroupOfColaborators } from 'src/users/entities/group-of-colaborators.entity';
import { Comment } from './comment.entity';

export const STATUS_TYPE = ['PENDING', 'DONE'] as const;
export type StatusType = (typeof STATUS_TYPE)[number];

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255})
  title: string;
  
  @Column('varchar', { length: 650 })
  description: string;

  @Column('date', { nullable: true })
  date: Date;
  
  @Column('enum', { enum: STATUS_TYPE, default:'PENDING'})
  status: StatusType;
  
  @ManyToMany(() => User, (user) => user.tasks, {onDelete: 'CASCADE'})
  @JoinTable()
  users: User[];

  @ManyToMany(() => GroupOfColaborators, (groupOfColaborators) => groupOfColaborators.tasks)
  @JoinTable()
  groupOfColaborators: GroupOfColaborators[];

  @ManyToOne(() => Project, (project) => project.tasks, {onDelete: 'CASCADE'})
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
  comments: Comment[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
