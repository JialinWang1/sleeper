import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { EventPattern, Payload } from '@nestjs/microservices'
import { NotifyEmailDto } from './dto/notify-email.dto'
import { NOTIFY_EMAIL } from '@app/common'

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(NOTIFY_EMAIL)
  @UsePipes(new ValidationPipe())
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    this.notificationsService.notifyEmail(data)
  }
}
