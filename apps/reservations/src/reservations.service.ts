import { UserDto } from './../../../libs/common/src/dto/user.dto'
import { ReservationRepository } from './reservations.repository'
import { Inject, Injectable } from '@nestjs/common'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { UpdateReservationDto } from './dto/update-reservation.dto'
import { PAYMENT_SERVICE } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import { map } from 'rxjs'

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentsService: ClientProxy
  ) {}

  async create(createReservationDto: CreateReservationDto, { email, _id: userId }: UserDto) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email
      })
      .pipe(
        map(async (res) => {
          return await this.reservationRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId
          })
        })
      )
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
