import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto'

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}

  private stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-04-10'
  })

  async createCharge({ card, amount }: CreateChargeDto) {
    const paymentMethods = await this.stripe.paymentMethods.create({
      type: 'card',
      card
    })
    const a = await this.stripe.paymentIntents.create({
      payment_method: paymentMethods.id,
      payment_method_types: ['card'],
      amount: amount * 100,
      currency: 'usd',
      confirm: true
    })
    return a
  }
}
