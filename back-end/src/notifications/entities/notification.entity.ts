import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  commentId: string;

  @Column()
  taskId: string;

  @Column()
  projectId: string;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  authorId: string;

  @Column('varchar', { length: 255})
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
