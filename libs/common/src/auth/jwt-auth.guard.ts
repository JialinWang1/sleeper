import {
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { catchError, map, Observable, of, tap } from 'rxjs'
import { AUTH_SERVICE } from '../constants/services'
import { ClientProxy } from '@nestjs/microservices'
import { Reflector } from '@nestjs/core'
import { User } from '../models'

export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name)

  private readonly AUTH_SERVICE = 'AUTH_SERVICE'
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication
    if (!jwt) return false

    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt
      })
      .pipe(
        tap((res) => {
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.map((role) => role.name).includes(role)) {
                this.logger.log(`User ${res.email} doesn't have role ${role}`)
                throw new UnauthorizedException()
              }
            }
          }
          context.switchToHttp().getRequest().user = res
        }),
        map(() => true),
        catchError((error) => {
          this.logger.error(error)
          return of(false)
        })
      )
  }
}
