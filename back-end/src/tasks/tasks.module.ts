import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { GroupOfColaborators } from 'src/users/entities/group-of-colaborators.entity';
import { Comment } from './entities/comment.entity';
import { NotificationGateway } from '../notifications/notification-gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Project, GroupOfColaborators, Comment]), NotificationsModule],
  controllers: [TasksController],
  providers: [TasksService, NotificationGateway],
})
export class TasksModule {}
