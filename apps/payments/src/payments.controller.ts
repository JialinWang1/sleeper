import { MessagePattern, Payload } from '@nestjs/microservices'
import { Controller, Get } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { CreateChargeDto } from '@app/common'

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  async createCharge(@Payload() createChargeDto: CreateChargeDto) {
    return this.paymentsService.createCharge(createChargeDto)
  }
}
