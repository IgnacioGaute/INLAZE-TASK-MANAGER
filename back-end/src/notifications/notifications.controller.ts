import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthOrTokenAuthGuard } from 'src/utils/guards/auth-or-token.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthOrTokenAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @Req() req,
    @Query('isRead') isRead?: string,
  ) {
    const userId = req.user.id;
    const unreadOnly = isRead === 'false';

    const notifs = unreadOnly
      ? await this.notificationsService.getUnreadNotifications(userId)
      : await this.notificationsService.getAllNotifications(userId);

    return Promise.all(
      notifs.map((n) => this.notificationsService.enrichNotification(n)),
    );
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
