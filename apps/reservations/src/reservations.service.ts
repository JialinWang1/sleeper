import { ReservationRepository } from './reservations.repository'
import { Inject, Injectable } from '@nestjs/common'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { UpdateReservationDto } from './dto/update-reservation.dto'
import { PAYMENT_SERVICE } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentsService: ClientProxy
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    console.log('charge start')
    await this.paymentsService
      .send('create_charge', createReservationDto.charge)
      .subscribe(async (charge) => {
        console.log('charge' + charge)
        const rs = await this.reservationRepository.create({
          ...createReservationDto,
          timestamp: new Date(),
          userId
        })
        console.log(rs)
        return rs
      })
  }

  findAll() {
    return this.reservationRepository.find({})
  }

  findOne(_id: string) {
    return this.reservationRepository.findOne({ _id })
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate({ _id }, { $set: updateReservationDto })
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id })
  }
}
