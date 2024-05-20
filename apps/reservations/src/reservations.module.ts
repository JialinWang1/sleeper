import Joi from 'joi'
import { Module } from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { ReservationsController } from './reservations.controller'
import {
  DatabaseModule,
  HealthModule,
  LoggerModule,
  PAYMENT_SERVICE,
  AUTH_SERVICE
} from '@app/common'
import { ReservationRepository } from './reservations.repository'
import { Reservation } from './models/reservation.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENT_HOST: Joi.string().required(),
        PAYMENT_PORT: Joi.number().required()
      })
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'auth'
          }
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'payments'
          }
        }),
        inject: [ConfigService]
      }
    ]),
    HealthModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository]
})
export class ReservationsModule {}
