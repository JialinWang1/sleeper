import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../models/user.entity'

export const CurrentUser = createParamDecorator((_data, context: ExecutionContext) =>
  getCurrentUserByContext(context)
)

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user
}
