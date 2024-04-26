import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService } from '../users/users.service'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { TokenPayload } from '../interfaces/token-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.Authentication || request?.Authentication
      ]),
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId })
  }
}
