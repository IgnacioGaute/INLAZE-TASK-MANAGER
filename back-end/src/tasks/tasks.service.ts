import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskStatusDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { GroupOfColaborators } from 'src/users/entities/group-of-colaborators.entity';
import { Comment } from './entities/comment.entity';
import { NotificationGateway } from '../notifications/notification-gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateCommentDto } from './dto/create-comment.dto';


@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    
    constructor(
      @InjectRepository(Task)
      private readonly taskRepository: Repository<Task>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Project)
      private readonly projectRepository: Repository<Project>,
      @InjectRepository(GroupOfColaborators)
      private readonly groupOfColaboratorsRepository: Repository<GroupOfColaborators>,
      @InjectRepository(Comment)
      private readonly commentRepository: Repository<Comment>,
      private readonly notificationGateway: NotificationGateway,
      private readonly notificationsService: NotificationsService,
    ) {}

async create(createTaskDto: CreateTaskDto, projectId: string) {
  try {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    let users = [];
    let groupOfColaborators = [];

    if (createTaskDto.users?.length) {
      users = await this.userRepository.findBy({ id: In(createTaskDto.users) });

      if (users.length !== createTaskDto.users.length) {
        throw new NotFoundException(`Some users not found`);
      }
    }

    if (createTaskDto.groupOfColaborators?.length) {
      groupOfColaborators = await this.groupOfColaboratorsRepository.findBy({
        id: In(createTaskDto.groupOfColaborators),
      });

      if (groupOfColaborators.length !== createTaskDto.groupOfColaborators.length) {
        throw new NotFoundException(`Some groups not found`);
      }
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      project,
      users,
      groupOfColaborators,
    });

    const taskSaved = await this.taskRepository.save(task);

    return taskSaved;
  } catch (error) {
    this.logger.error(error.message, error.stack);
    throw error;
  }
}


    
  async findAll(query: PaginateQuery): Promise<Paginated<Task>> {
    try {
      return await paginate(query, this.taskRepository, {
        sortableColumns: ['id', 'date'],
        nullSort: 'last',
        defaultSortBy: [['createdAt', 'DESC']],
        searchableColumns: ['date'],
        filterableColumns: {
          title: [FilterOperator.ILIKE, FilterOperator.EQ],
          date: [FilterOperator.ILIKE, FilterOperator.EQ],
        },
        relations: ['users', 'groupOfColaborators', 'project'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['users'],
      });
  
      if (!task) {
        throw new NotFoundException(`Task not found`);
      }
  
      return task;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }
  

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['users', 'groupOfColaborators', 'project'],
      });

      if (!task) {
        throw new NotFoundException(`Task not found`);
      }

      let users = [];
      if (updateTaskDto.users?.length) {
        users = await this.userRepository.findBy({
          id: In(updateTaskDto.users),
        });

        if (users.length !== updateTaskDto.users.length) {
          throw new NotFoundException('One or more users not found');
        }
      }

      let groupOfColaborators = [];
      if (updateTaskDto.groupOfColaborators?.length) {
        groupOfColaborators = await this.groupOfColaboratorsRepository.findBy({
          id: In(updateTaskDto.groupOfColaborators),
        });

        if (groupOfColaborators.length !== updateTaskDto.groupOfColaborators.length) {
          throw new NotFoundException('One or more groups not found');
        }
      }

      const { users: _, groupOfColaborators: __, ...rest } = updateTaskDto;
      this.taskRepository.merge(task, rest);

      task.users = users;
      task.groupOfColaborators = groupOfColaborators;

      const savedTask = await this.taskRepository.save(task);

      return savedTask;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }


async remove(id: string) {
  try {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['users', 'groupOfColaborators'],
    });

    if (!task) {
      throw new NotFoundException(`Task not found`);
    }

    if (Array.isArray(task.users)) {
      for (const user of task.users) {
        if (Array.isArray(user.tasks)) {
          user.tasks = user.tasks.filter(t => t.id !== task.id);
          await this.userRepository.save(user);
        }
      }
    }
    if (Array.isArray(task.groupOfColaborators)) {
      for (const group of task.groupOfColaborators) {
        if (Array.isArray(group.tasks)) {
          group.tasks = group.tasks.filter(t => t.id !== task.id);
          await this.groupOfColaboratorsRepository.save(group);
        }
      }
    }

    await this.taskRepository.remove(task);

    return { message: 'Task removed successfully' };
  } catch (error) {
    if (!(error instanceof NotFoundException)) {
      this.logger.error(error.message, error.stack);
    }
    throw error;
  }
}


   async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    try{
      const task = await this.taskRepository.findOne({where:{id:id}});
  
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      task.status = updateTaskStatusDto.status;

      const savedTask = await this.taskRepository.save(task);

      return savedTask;
      
    }catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const { taskId, userId, content } = createCommentDto;

      const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['project', 'users', 'groupOfColaborators', 'groupOfColaborators.users'],
      });
      if (!task) throw new NotFoundException('Task not found');

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const comment = this.commentRepository.create({ content, task, author: user });
      await this.commentRepository.save(comment);

      const directUsers = task.users || [];
      const groupUsers = task.groupOfColaborators?.flatMap(g => g.users) || [];

      const allUsersMap = new Map<string, User>();
      directUsers.forEach(u => allUsersMap.set(u.id, u));
      groupUsers.forEach(u => allUsersMap.set(u.id, u));

      allUsersMap.delete(user.id);


      for (const [_, relatedUser] of allUsersMap) {
        const notification = await this.notificationsService.createNotification({
          userId: relatedUser.id,
          authorId: user.id, 
          message: comment.content,
          type: 'NEW_COMMENT',
          commentId: comment.id,
          taskId: task.id,
          projectId: task.project.id,
          isRead: false,
        });

        this.notificationGateway.sendNotificationToUser(relatedUser.id, {
          id: notification.id,
          type: notification.type,
          commentId: notification.commentId,
          userId: notification.userId,
          taskId: notification.taskId,
          taskTitle: task?.title,
          projectId: task?.project?.id,
          projectName: task?.project?.title,
          userName: user ? `${user.firstName} ${user.lastName}` : undefined,
          message: notification['message'],
        });

      }

      return comment;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }


}
