import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationGateway } from './notification-gateway';
import { Task } from 'src/tasks/entities/task.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(data: Partial<Notification>): Promise<Notification> {
  try {
    const notification = this.notificationRepository.create(data);
    const saved = await this.notificationRepository.save(notification);

    const enriched = await this.enrichNotification(saved);
    this.notificationGateway.sendNotificationToUser(saved.userId, enriched);

    return saved;
  } catch (error) {
    this.logger.error('Error creating notification', error.stack);
    throw error;
  }
}


  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { userId, isRead: false },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Error getting unread notifications for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAllNotifications(userId: string): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Error getting all notifications for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      this.logger.log(`Marking notification ${notificationId} as read`);
      const notif = await this.notificationRepository.findOne({
        where: { id: notificationId },
      });
      if (!notif) throw new Error('Notification not found');
      notif.isRead = true;
      return await this.notificationRepository.save(notif);
    } catch (error) {
      this.logger.error(
        `Error marking notification as read: ${notificationId}`,
        error.stack,
      );
      throw error;
    }
  }

  async enrichNotification(notification: Notification): Promise<any> {
    try {
      const task = notification.taskId
        ? await this.taskRepository.findOne({
            where: { id: notification.taskId },
            relations: ['project'],
          })
        : null;


        const author = notification['authorId']
    ? await this.userRepository.findOne({ where: { id: notification['authorId'] } })
    : null;


      return {
        id: notification.id,
        type: notification.type,
        commentId: notification.commentId,
        userId: notification.userId,
        userName: author ? `${author.firstName} ${author.lastName}` : undefined,
        taskId: notification.taskId,
        taskTitle: task?.title,
        projectId: task?.project?.id,
        projectName: task?.project?.title,
        message: notification['message'],
      };
    } catch (error) {
      this.logger.error(`Error enriching notification`, error.stack);
      throw error;
    }
  }

}
