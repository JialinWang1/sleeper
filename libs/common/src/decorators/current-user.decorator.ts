import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../interfaces'

export const CurrentUser = createParamDecorator((_data, context: ExecutionContext) =>
  getCurrentUserByContext(context)
)

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user
}
