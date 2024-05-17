import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersRepository } from './users.repository'
import bcrypt from 'bcryptjs'
import { GetUserDto } from './dto/get-user.dto'
import { User } from '@app/common'
import { Role } from '@app/common/models/role.entity'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto, { roles: true })
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto)

    const password = await bcrypt.hash(createUserDto.password, 10)
    const newUser = new User({
      ...createUserDto,
      password,
      roles: createUserDto.roles?.map((roleDto) => new Role(roleDto))
    })
    return this.userRepository.create(newUser)
  }

  async validateCreateUser(createUser: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUser.email })
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
