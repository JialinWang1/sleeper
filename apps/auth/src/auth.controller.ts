import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Response } from 'express'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser, UserDocument, User } from '@app/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: UserDocument, @Res({ passthrough: true }) response: Response) {
    await this.authService.login(user, response)
    return user
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() data: { user: User }) {
    return data.user
  }
}
