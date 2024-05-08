import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserDocument } from '../models/user.schema'

export const CurrentUser = createParamDecorator((_data, context: ExecutionContext) =>
  getCurrentUserByContext(context)
)

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user
}
