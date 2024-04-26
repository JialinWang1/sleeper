import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'
import { LoggerModule } from '@app/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string().required(),
        PORT: Joi.number().required()
      })
    }),
    LoggerModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
