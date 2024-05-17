import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CurrentUser, User } from '@app/common'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: User) {
    return user
  }
}
