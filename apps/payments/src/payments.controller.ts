import { MessagePattern, Payload } from '@nestjs/microservices'
import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateChargeDto } from '@app/common'
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto'
import { PaymentsService } from './payments.service'

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data)
  }
}
