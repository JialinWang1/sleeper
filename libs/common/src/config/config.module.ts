import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { Module } from '@nestjs/common';
import Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URI: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
