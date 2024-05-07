import { ConfigService } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto'
import { NOTIFICATION_SERVICE, NOTIFY_EMAIL } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto'
import { text } from 'stream/consumers'

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationsService: ClientProxy
  ) {}

  private stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-04-10'
  })

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    // const paymentMethods = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card
    // })
    const a = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      return_url: 'https://garrin.com',
      amount: amount * 100,
      currency: 'usd',
      confirm: true
    })

    this.notificationsService.emit(NOTIFY_EMAIL, {
      email,
      text: `Your payment of $${amount} has made.`
    })
    return a
  }
}
