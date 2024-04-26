import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersRepository } from './users.repository'
import bcrypt from 'bcryptjs'
import { log } from 'console'
import { GetUserDto } from './dto/get-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto)
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto)

    const password = await bcrypt.hash(createUserDto.password, 10)

    return this.userRepository.create({
      ...createUserDto,
      password
    })
  }

  async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email })
    } catch (error) {
      return
    }
    throw new UnprocessableEntityException('Email already exists!')
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email })
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Credentials are not valid!')
    }

    return user
  }
}
