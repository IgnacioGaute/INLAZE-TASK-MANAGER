import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service'

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  private usersMap = new Map<string, string>();

  constructor(private readonly notificationService: NotificationsService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.usersMap.set(userId, client.id);
      this.logger.log(`Client connected: ${client.id}, userId: ${userId}`);

      const pendingNotifications = await this.notificationService.getUnreadNotifications(userId);

      for (const notification of pendingNotifications) {
        const enriched = await this.notificationService.enrichNotification(notification);
        this.server.to(client.id).emit('notification', enriched);
      }


    } else {
      this.logger.warn(`Client connected without userId: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.usersMap.entries()) {
      if (socketId === client.id) {
        this.usersMap.delete(userId);
        this.logger.log(`Client disconnected: ${client.id}, userId: ${userId}`);
        break;
      }
    }
  }

  sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.usersMap.get(userId);
    if (socketId) {
      this.logger.log(`Sending notification to socket ${socketId} for user ${userId}`);
      this.server.to(socketId).emit('notification', notification);
    } else {
      this.logger.warn(`No socket connected for user ${userId}`);
    }
  }
}
