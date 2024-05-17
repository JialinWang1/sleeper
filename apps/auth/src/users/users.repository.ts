import { AbstractRepository, User } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, EntityManager } from 'typeorm'

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected logger = new Logger(UsersRepository.name)

  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    entityManager: EntityManager
  ) {
    super(userRepository, entityManager)
  }
}
