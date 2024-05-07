import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'
import { LoggerModule, NOTIFICATION_SERVICE } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PaymentsService } from './payments.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string().required(),
        NOTIFICATION_HOST: Joi.string().required(),
        NOTIFICATION_PORT: Joi.number().required(),
        PORT: Joi.number().required()
      })
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATION_HOST'),
            port: configService.get('NOTIFICATION_PORT')
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
